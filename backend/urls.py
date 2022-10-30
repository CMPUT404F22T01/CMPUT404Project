from django.urls import path 
from . import views
from .viewsets import LoginViewSet, RefreshTokenViewSet
from rest_framework_nested import routers



router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='auth_login')
router.register(r'refresh', RefreshTokenViewSet, basename='auth_refresh')

urlpatterns = [
    path('register/', views.AuthorCreate.as_view()),
    path('data/', views.testAuth),
    # Author routes!
    path('authors/', views.getAllAuthors), # TODO add pagination
    path('authors/<uuid:uuidOfAuthor>', views.getSingleAuthor),
    # Comment routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments', views.getAllComments),
    # Like routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/likes', views.getAllPostLikes),
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments/<uuid:uuidOfComment>/likes', views.getAllCommentLikes),
    path('authors/<uuid:uuidOfAuthor>/liked', views.getAllAuthorLiked),
    # Follower routes!
    path('authors/<uuid:uuidOfAuthor>/followers', views.getAllFollowers),
    path('authors/<uuid:authorID>/followers/<uuid:foreignAuthor>', views.handleSingleFollow),
    
    *router.urls,
]