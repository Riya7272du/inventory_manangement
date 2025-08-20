from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import (
    SignupSerializer, LoginSerializer, UserSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)

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

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    serializer = PasswordResetRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            result = serializer.save()

            if not result.get('user_exists', False):
                return Response({
                    'success': False,
                    'message': 'No account exists with this email address.',
                    'email': result.get('email')
                }, status=status.HTTP_404_NOT_FOUND)
            
            response_data = {
                'success': True,
                'message': 'Reset details provided for existing account.',
                'email': result.get('email')
            }
            
            if 'uid' in result and 'token' in result:
                response_data.update({
                    'reset_details': {
                        'uid': result.get('uid'),
                        'token': result.get('token'),
                        'user_id': result.get('user_id'),
                        'username': result.get('username')
                    },
                    'instructions': 'Use the UID and token in the email with /api/auth/password-reset-confirm/ to reset password.'
                })
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error processing password reset request.',
                'error': str(e) if settings.DEBUG else 'Server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Please provide a valid email address.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
 
            Token.objects.filter(user=user).delete()
            
            return Response({
                'success': True,
                'message': 'Password has been reset successfully.',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'note': 'Please login with your new password to get a new auth token.'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Error resetting password.',
                'error': str(e) if settings.DEBUG else 'Server error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'message': 'Invalid reset data.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def validate_reset_token(request):
    uid = request.data.get('uid')
    token = request.data.get('token')
    
    if not uid or not token:
        return Response({
            'success': False,
            'valid': False,
            'message': 'Both UID and token are required.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id, is_active=True)
    
        valid = default_token_generator.check_token(user, token)
        
        return Response({
            'success': True,
            'valid': valid,
            'message': 'Token is valid.' if valid else 'Token is invalid or expired.',
            'user_info': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            } if valid else None
        }, status=status.HTTP_200_OK)
        
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({
            'success': True,
            'valid': False,
            'message': 'Invalid UID or user not found.'
        }, status=status.HTTP_200_OK)