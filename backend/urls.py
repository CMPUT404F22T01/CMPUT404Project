from django.urls import path 
from .views import AuthorCreate

urlpatterns = [
    path('register/', AuthorCreate.as_view())
]