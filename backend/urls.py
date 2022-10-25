from django.urls import path 
from .views import AuthorCreate, GetAuthorData
from .viewsets import LoginViewSet, RefreshTokenViewSet
from rest_framework_nested import routers



router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='auth_login')
router.register(r'refresh', RefreshTokenViewSet, basename='auth_refresh')

urlpatterns = [
    path('register/', AuthorCreate.as_view()),
    path('data/', GetAuthorData.as_view()),
    
    *router.urls,
]