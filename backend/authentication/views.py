from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.conf import settings
from .serializers import SignupSerializer, LoginSerializer, UserSerializer

def set_auth_cookie(response, token):
    response.set_cookie(
        key=getattr(settings, 'AUTH_COOKIE_NAME', 'auth_token'),
        value=token,
        max_age=getattr(settings, 'AUTH_COOKIE_MAX_AGE', 60 * 60 * 24 * 7),  # 7 days
        secure=getattr(settings, 'AUTH_COOKIE_SECURE', False),
        httponly=getattr(settings, 'AUTH_COOKIE_HTTP_ONLY', True),
        samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax')
    )

def clear_auth_cookie(response):
    response.delete_cookie(
        key=getattr(settings, 'AUTH_COOKIE_NAME', 'auth_token'),
        samesite=getattr(settings, 'AUTH_COOKIE_SAMESITE', 'Lax')
    )

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


