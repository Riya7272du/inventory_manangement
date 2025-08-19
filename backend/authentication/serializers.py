from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings


class SignupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=150, write_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=['manager', 'admin'], default='manager')
    
    class Meta:
        model = User
        fields = ('name', 'email', 'password', 'role')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()
    
    def create(self, validated_data):
        name = validated_data.pop('name')
        role = validated_data.pop('role')
        email = validated_data['email']
        username = email.split('@')[0]

        counter = 1
        original_username = username
        while User.objects.filter(username=username).exists():
            username = f"{original_username}{counter}"
            counter += 1
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=name,
        )

        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
        else:  # manager
            user.is_staff = True
            user.is_superuser = False
        
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')
        
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password.')
        
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', read_only=True)
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'email', 'role', 'date_joined', 'is_active')
        read_only_fields = ('id', 'username', 'date_joined')
    
    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'manager'
        return 'user'


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        return value
    
    def save(self, **kwargs):
        email = self.validated_data['email']
        
        try:
            user = User.objects.get(email=email, is_active=True)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            subject = 'Password Reset Request'
            message = f"""
Hello {user.first_name or user.username},

Your password reset details:
- User ID (UID): {uid}
- Reset Token: {token}

Use these details to reset your password.
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            
            return {
                'email': email,
                'uid': uid,
                'token': token,
                'user_id': user.id,
                'username': user.username,
                'message': 'Password reset email sent successfully',
                'user_exists': True
            }
            
        except User.DoesNotExist:
            return {
                'email': email,
                'message': 'No account exists with this email address',
                'user_exists': False
            }


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        uid = attrs.get('uid')
        token = attrs.get('token')
        new_password = attrs.get('new_password')
        new_password_confirm = attrs.get('new_password_confirm')
        
        if new_password != new_password_confirm:
            raise serializers.ValidationError("Passwords do not match.")
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=True)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid UID. Please check your reset details.")
        
        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid or expired reset token.")
            
        attrs['user'] = user
        return attrs
    
    def save(self, **kwargs):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user
