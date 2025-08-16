from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .serializers import SignupSerializer, LoginSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        user_serializer = UserSerializer(user)
        
        return Response({
            'success': True,
            'message': 'User created successfully',
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    
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
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Login failed', 
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)