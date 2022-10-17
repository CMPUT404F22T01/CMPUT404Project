from django.urls import path 
from .views import AuthorCreate
from .viewsets import LoginViewSet
from rest_framework_nested import routers



router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='auth_login')


urlpatterns = [
    path('register/', AuthorCreate.as_view()),
    *router.urls,
]