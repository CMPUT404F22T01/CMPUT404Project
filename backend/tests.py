from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import *
from datetime import date


# Create your tests here.
class AuthorTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        for i in range(len(uuid_tests)):
            Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            )

    def testDisplayName(self):
        author = Author.objects.get(id="631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEqual(author.displayName, 'Author Display Name 0')
        author = Author.objects.get(id="ca14e1e3-77ce-44e3-8529-85172744c45b")
        self.assertEqual(author.displayName, 'Author Display Name 1')

    def testHost(self):
        author = Author.objects.get(id="631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEqual(author.host, HOSTNAME)
        author = Author.objects.get(id="ca14e1e3-77ce-44e3-8529-85172744c45b")
        self.assertEqual(author.host, HOSTNAME)

    def testurl(self):
        author = Author.objects.get(id="ca14e1e3-77ce-44e3-8529-85172744c45b")
        self.assertEqual(author.url, HOSTNAME +
                         'authors/ca14e1e3-77ce-44e3-8529-85172744c45b')
        author = Author.objects.get(id="631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEqual(author.url, HOSTNAME +
                         'authors/631f3ebe-d976-4248-a808-db2442a22168')

    def test_userRegistration(self):
        data = {
            'username': 'TestUserRegistration',
            'displayName': 'TestUserRegistration',
            'password': '12345678',
            "github": "https://github.com/moxil-shah"
        }
        response = self.client.post(
            'http://127.0.0.1:8000/service/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Author.objects.get(
            username="TestUserRegistration").username, 'TestUserRegistration')
        self.assertEqual(Author.objects.get(username="TestUserRegistration").github,
                         'https://github.com/moxil-shah')

        tooShortPassword = {
            'username': 'TestUserRegistration2',
            'displayName': 'TestUserRegistration2',
            'password': '123',
            "github": "https://github.com/moxil-shah"
        }
        response = self.client.post(
            'http://127.0.0.1:8000/service/register/', tooShortPassword)
        # becuase password too short
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTestCase(APITestCase):

    def test_login(self):

        self.user = Author.objects.create_user(
            username='TestUserLogin', password='12345678')
        # Author object does not return password so we need to add password manually
        userData = {
            'username': self.user.username,
            'password': '12345678'
        }
        response = self.client.post(
            'http://127.0.0.1:8000/service/login/', userData)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

# class AuthorTest(APITestCase):

#     def test_author_creation(self):
#         self.user = Author.objects.create_user(username='TestUserLogin', password='12345678')
