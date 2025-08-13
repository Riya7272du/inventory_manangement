from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),    # POST /api/auth/signup/
    path('login/', views.login, name='login'),       # POST /api/auth/login/
]