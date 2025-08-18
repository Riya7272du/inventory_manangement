from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': True},
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs
    
    def create(self, validated_data):
    
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    login = serializers.CharField(help_text="Username or Email")
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')
        
        if not login or not password:
            raise serializers.ValidationError('Must include email/username and password.')
        
        user = None
        if '@' in login:
            try:
                user_obj = User.objects.get(email=login)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
            except Exception as e:
                raise serializers.ValidationError('Authentication error occurred.')
        
        if not user:
            try:
                user = authenticate(username=login, password=password)
            except Exception as e:
                raise serializers.ValidationError('Authentication error occurred.')
        
        if not user:
            raise serializers.ValidationError('Invalid email/username or password.')
        
        try:
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
        except AttributeError:
            raise serializers.ValidationError('Invalid user account.')
        
        attrs['user'] = user
        return attrs
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'is_active')
        read_only_fields = ('id', 'date_joined')

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
Hello {user.username},

Your password reset details:
- User ID (UID): {uid}
- Reset Token: {token}

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
                'message': 'Password Reset email sent successfully',
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

