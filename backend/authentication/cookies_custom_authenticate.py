from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser

class CookieTokenAuthentication(TokenAuthentication):

    def authenticate(self, request):
        auth_token = request.COOKIES.get('auth_token')
        if auth_token:
            return self.authenticate_credentials(auth_token)
        
       
        return super().authenticate(request)
    
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.select_related('user').get(key=key)
        except Token.DoesNotExist:
            return None
        
        if not token.user.is_active:
            return None
        
        return (token.user, token)