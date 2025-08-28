from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import force_str
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    SignupSerializer, LoginSerializer, UserSerializer,
)
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
import re

def set_auth_cookie(response, token):
    cookie_settings = {
        'key': getattr(settings, 'AUTH_COOKIE_NAME', 'auth_token'),
        'value': token,
        'max_age': getattr(settings, 'AUTH_COOKIE_MAX_AGE', 60 * 60 * 24 * 7),
        'secure': getattr(settings, 'AUTH_COOKIE_SECURE', False),
        'httponly': getattr(settings, 'AUTH_COOKIE_HTTP_ONLY', True),
        'samesite': getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax')
    }
    response.set_cookie(**cookie_settings)

def clear_auth_cookie(response):
    response.delete_cookie(
        key=getattr(settings, 'AUTH_COOKIE_NAME', 'auth_token'),
        samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax')
    )

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        response = Response({
            'success': True,
            'message': 'User created successfully',
            'user': user_serializer.data,
            'token': token.key 
        }, status=status.HTTP_201_CREATED)
        set_auth_cookie(response, token.key)
        return response
    
    return Response({
        'success': False,
        'message': 'Signup failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        
        response = Response({
            'success': True,
            'message': 'Login successful',
            'user': user_serializer.data,
            'token': token.key  
        }, status=status.HTTP_200_OK)
    
        set_auth_cookie(response, token.key)
        return response

    return Response({
        'success': False,
        'message': 'Login failed. Please check your credentials.', 
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user_serializer = UserSerializer(request.user)
    
    return Response({
        'success': True,
        'user': user_serializer.data,
        'authenticated_via': 'cookie' if request.COOKIES.get('auth_token') else 'header'
    }, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        response = Response({
            'success': True,
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
    except:
        response = Response({
            'success': False,
            'message': 'Error logging out'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    clear_auth_cookie(response)
    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return Response({
            'error': 'Please enter a valid email address'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"
        
        subject = "Reset Your Password - Inventory System"
        message = f"""
Hello {user.first_name },

Click the link below to reset your password:
{reset_link}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Thanks
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'success': True,
            'message': 'Password reset email sent successfully'
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': True,
            'message': 'If that email exists, a reset link has been sent'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Failed to send reset email. Please try again later.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, uidb64, token):
    new_password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')
    
    if not new_password or not confirm_password:
        return Response({
            'error': 'Both password fields are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_password != confirm_password:
        return Response({
            'error': 'Passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            'error': 'Password must be at least 8 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        
        if not default_token_generator.check_token(user, token):
            return Response({
                'error': 'Invalid or expired reset link'
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        
        return Response({
            'success': True,
            'message': 'Password updated successfully'
        }, status=status.HTTP_200_OK)
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'error': 'Invalid reset link'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': 'Failed to reset password. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    