from django.urls import path 
from . import views
from .viewsets import LoginViewSet, RefreshTokenViewSet
from rest_framework_nested import routers



router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='auth_login')
router.register(r'refresh', RefreshTokenViewSet, basename='auth_refresh')

urlpatterns = [
    path('register/', views.AuthorCreate.as_view()),
    # Author routes!
    path('authors/', views.getAllAuthors), # TODO add pagination
    path('authors/<uuid:uuidOfAuthor>', views.getSingleAuthor),
    # Follower routes!
    path('authors/<uuid:uuidOfAuthor>/followers', views.getAllFollowers),
    path('authors/<uuid:uuidOfFollower>/followers/<uuid:uuidOfFollowing>', views.handleSingleFollow),
    
    *router.urls,
]