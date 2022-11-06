from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Author

 
# Create your tests here.
class UserRegistrationTestCase(APITestCase):

    def test_userRegistration(self):
        data = {
            'username': 'TestUserRegistration',
            'display_name': 'TestUserRegistration',
            'password': '12345678',
        }
        response = self.client.post('http://127.0.0.1:8000/service/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class LoginTestCase(APITestCase):

    def test_login(self):
       
        self.user = Author.objects.create_user(username='TestUserLogin', password='12345678')
        # Author object does not return password so we need to add password manually
        userData = {
            'username': self.user.username,
            'password': '12345678'
        } 
        response = self.client.post('http://127.0.0.1:8000/service/login/', userData) 
        self.assertEqual(response.status_code, status.HTTP_200_OK)
     