from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import *
from datetime import date
import json


# contains views tests and models tests belos

###### VIEWS TESTS ######
class AuthorRoutesTests(TestCase):
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

    def testAuthorsEndpoint(self):
        res = self.client.get("/authors/")
        self.assertEqual(res.status_code, 200)

    def testAuthorCount(self):
        res = self.client.get("/authors/")
        self.assertEqual(res.status_code, 200)
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(len(body["items"]), 2)
    
    def testNotRealAuthor(self):
        res = self.client.get("/author/282848/")
        self.assertEqual(res.status_code, 404)
    
    def testRealAuthor(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/")
        self.assertEqual(res.status_code, 200)
 
class FollowersRoutesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        
        authors = []
        
        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
            
        Follower.objects.create(
        id = "5cdfd032-7d84-446f-9a60-c451212ad0a6",
        follower = authors[0],
        following = authors[1],
        )

    def testFollowersEndpoint(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/followers/")
        self.assertEqual(res.status_code, 200)
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(len(body["items"]), 0)
        
    def testIFFollwerExists(self):
        res = self.client.get("/authors/ca14e1e3-77ce-44e3-8529-85172744c45b/followers/")
        self.assertEqual(res.status_code, 200)
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(len(body["items"]), 1)
    
    def testForeignAuthorTest(self):
        res = self.client.get("/authors/ca14e1e3-77ce-44e3-8529-85172744c45b/followers/631f3ebe-d976-4248-a808-db2442a22168")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(body["follower"]['id'], HOSTNAME+"authors/631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEqual(body["following"]['id'], HOSTNAME+"authors/ca14e1e3-77ce-44e3-8529-85172744c45b")

class PostRoutesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
        POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        
        POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22167",
            image_url="http://127.0.0.1:8000/author/ca14e1e3-77ce-44e3-8529-85172744c45b/post/631f3ebe-d976-4248-a808-db2442a22167",
            title="Post Title 2",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 2",
            contentType="text/plain",
            content="Post content 2",
            author=authors[1],
        )

    def testallAuthorPosts(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/")
        self.assertEqual(res.status_code, 200)
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(len(body["items"]), 1) # becuase only 1 post
        self.assertEqual(body["items"][0]["id"], "https://github.com/CMPUT404F22T01/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169")
        
    def testSpecificPost(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(res.status_code, 200)
        body = json.loads(res.content.decode("utf-8"))
        self.assertEquals(body["id"], "https://github.com/CMPUT404F22T01/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169")
     
class CommentRoutesTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
            
        aPost = POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        
        Comment.objects.create(
        id="77fce8fb-3439-4010-b854-0f6fd44c9c3f",
        author = authors[1],
        post = aPost,
        comment = "Comment 1",
        )
    
    def testCommentsEndPoint(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169/comments/")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEqual(len(body["comments"]), 1)
        self.assertEqual((body["comments"][0]["author"]["id"]), "https://c404t3.herokuapp.com/authors/ca14e1e3-77ce-44e3-8529-85172744c45b")
        self.assertEqual((body["comments"][0]["author"]["displayName"]), "Author Display Name 1")
        
class LikesAndLikedTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
        aPost = POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        postLike = Like.objects.create(
            id = "3a49d082-9b61-4972-8d22-0066e4aea309",
            object_id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = authors[1],
            object_type = "post",
        )
        
        aComment = Comment.objects.create(
        id="77fce8fb-3439-4010-b854-0f6fd44c9c3f",
        author = authors[1],
        post = aPost,
        comment = "Comment 1",
        )
        
        commentLike = Like.objects.create(
            id = "4695f35e-9e01-4cc1-ba66-450c378b2b64",
            object_id = aComment.id,
            author = authors[1],
            object_type = "comment",
        )
        
    def testPostLike(self):
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169/likes/")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEquals(body[0]["author"]["displayName"], "Author Display Name 1")
        self.assertEquals(body[0]["author"]["id"], "https://c404t3.herokuapp.com/authors/ca14e1e3-77ce-44e3-8529-85172744c45b")


    def testCommentLike(self):
        # non existent comment
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169/comments/77fce8fb-3439-4010-b854-0f6fd44c9c3a/likes/")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEquals(len(body), 0)
        
        # existent comment
        res = self.client.get("/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169/comments/77fce8fb-3439-4010-b854-0f6fd44c9c3f/likes/")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEquals(len(body), 1)
        self.assertEquals(body[0]["author"]["displayName"], "Author Display Name 1")
        self.assertEquals(body[0]["author"]["id"], "https://c404t3.herokuapp.com/authors/ca14e1e3-77ce-44e3-8529-85172744c45b")
    
    def testLiked(self):
        res = self.client.get("/authors/ca14e1e3-77ce-44e3-8529-85172744c45b/liked/")
        body = json.loads(res.content.decode("utf-8"))
        self.assertEquals(body[0]["author"]["displayName"], "Author Display Name 1")
        self.assertEquals(body[0]["author"]["id"], "https://c404t3.herokuapp.com/authors/ca14e1e3-77ce-44e3-8529-85172744c45b")

    
###### MODEL TESTS ######
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

    def testUrl(self):
        author = Author.objects.get(id="ca14e1e3-77ce-44e3-8529-85172744c45b")
        self.assertEqual(author.url(), HOSTNAME +
                         'authors/ca14e1e3-77ce-44e3-8529-85172744c45b')
        author = Author.objects.get(id="631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEqual(author.url(), HOSTNAME +
                         'authors/631f3ebe-d976-4248-a808-db2442a22168')

    def testUserRegistration(self):
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

class PostsTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
        POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        
        POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22167",
            image_url="http://127.0.0.1:8000/author/ca14e1e3-77ce-44e3-8529-85172744c45b/post/631f3ebe-d976-4248-a808-db2442a22167",
            title="Post Title 2",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 2",
            contentType="text/plain",
            content="Post content 2",
            author=authors[1],
        )

    def testTitle(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.title, 'Post Title 1')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.title, 'Post Title 2')

    def testImageUrl(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.image_url, "http://127.0.0.1:8000/" + "author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169")
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.image_url, "http://127.0.0.1:8000/" + "author/ca14e1e3-77ce-44e3-8529-85172744c45b/post/631f3ebe-d976-4248-a808-db2442a22167")

    def testSource(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.source, 'https://github.com/CMPUT404F22T01/')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.source, 'https://github.com/CMPUT404F22T01/')
        
    def testOrigin(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.origin, 'https://github.com/CMPUT404F22T01/')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.source, 'https://github.com/CMPUT404F22T01/')
        
    def testDescription(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.description, 'Post description 1')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.description, 'Post description 2')
        
    def testContent(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(post.content, 'Post content 1')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(post.content, 'Post content 2')
        
    def testAuthor(self):
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22169")
        self.assertEqual(str(post.author.id), '631f3ebe-d976-4248-a808-db2442a22168')
        post = POST.objects.get(id="631f3ebe-d976-4248-a808-db2442a22167")
        self.assertEqual(str(post.author.id), 'ca14e1e3-77ce-44e3-8529-85172744c45b')
  
class CommentsTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
            
        aPost = POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        
        Comment.objects.create(
        id="77fce8fb-3439-4010-b854-0f6fd44c9c3f",
        author = authors[1],
        post = aPost,
        comment = "Comment 1",
        )
        
    def testComment(self):
        aComment = Comment.objects.get(id="77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        self.assertEqual(aComment.comment, "Comment 1")   
        
    def testUrl(self):
        aComment = Comment.objects.get(id="77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        self.assertEqual(aComment.get_id(), "https://github.com/CMPUT404F22T01/authors/ca14e1e3-77ce-44e3-8529-85172744c45b/posts/631f3ebe-d976-4248-a808-db2442a22169/comments/77fce8fb-3439-4010-b854-0f6fd44c9c3f")
    
    def testCommentAuthor(self):
        aComment = Comment.objects.get(id="77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        self.assertEqual(str(aComment.author.id), "ca14e1e3-77ce-44e3-8529-85172744c45b")
    
    def testCommentPostAuthor(self):
        aComment = Comment.objects.get(id="77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        self.assertEqual(str(aComment.post.author.id), "631f3ebe-d976-4248-a808-db2442a22168")
    
class LikeTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
        aPost = POST.objects.create(
            id="631f3ebe-d976-4248-a808-db2442a22169",
            image_url="http://127.0.0.1:8000/author/631f3ebe-d976-4248-a808-db2442a22168/post/631f3ebe-d976-4248-a808-db2442a22169",
            title="Post Title 1",
            source="https://github.com/CMPUT404F22T01/",
            origin="https://github.com/CMPUT404F22T01/",
            description="Post description 1",
            contentType="text/plain",
            content="Post content 1",
            author=authors[0],
        )
        postLike = Like.objects.create(
            id = "3a49d082-9b61-4972-8d22-0066e4aea309",
            object_id = "631f3ebe-d976-4248-a808-db2442a22169",
            author = authors[1],
            object_type = "post",
        )
        
        aComment = Comment.objects.create(
        id="77fce8fb-3439-4010-b854-0f6fd44c9c3f",
        author = authors[1],
        post = aPost,
        comment = "Comment 1",
        )
        
        commentLike = Like.objects.create(
            id = "4695f35e-9e01-4cc1-ba66-450c378b2b64",
            object_id = aComment.id,
            author = authors[1],
            object_type = "comment",
        )
        
    def testLikeAuthor(self):
        aLike = Like.objects.get(id="3a49d082-9b61-4972-8d22-0066e4aea309")
        self.assertEqual(str(aLike.author.id), "ca14e1e3-77ce-44e3-8529-85172744c45b")
    
    def testPostIsLiked(self):
        aLike = Like.objects.get(id="3a49d082-9b61-4972-8d22-0066e4aea309")
        self.assertEqual(str(aLike.object_id), "631f3ebe-d976-4248-a808-db2442a22169")
      
    def testCommentIsLiked(self):
        aLike = Like.objects.get(id="4695f35e-9e01-4cc1-ba66-450c378b2b64")
        self.assertEqual(str(aLike.object_id), "77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        
    def testObjectUrl(self):
        aLike = Like.objects.get(id="3a49d082-9b61-4972-8d22-0066e4aea309")
        self.assertEqual(aLike.object_url(), "https://github.com/CMPUT404F22T01/authors/631f3ebe-d976-4248-a808-db2442a22168/posts/631f3ebe-d976-4248-a808-db2442a22169")
        aLike = Like.objects.get(id="4695f35e-9e01-4cc1-ba66-450c378b2b64")
        self.assertEqual(aLike.object_url(), "https://github.com/CMPUT404F22T01/authors/ca14e1e3-77ce-44e3-8529-85172744c45b/posts/631f3ebe-d976-4248-a808-db2442a22169/comments/77fce8fb-3439-4010-b854-0f6fd44c9c3f")
        
    def testSummary(self):
        aLike = Like.objects.get(id="3a49d082-9b61-4972-8d22-0066e4aea309")
        self.assertEqual(aLike.summary(), 'Author Display Name 1 Likes your post')
        aLike = Like.objects.get(id="4695f35e-9e01-4cc1-ba66-450c378b2b64")
        self.assertEqual(aLike.summary(), 'Author Display Name 1 Likes your comment')
        
    def testTypeOfWhatIsLiked(self):
        aLike = Like.objects.get(id="3a49d082-9b61-4972-8d22-0066e4aea309")
        self.assertEqual(aLike.object_type, 'post')
        aLike = Like.objects.get(id="4695f35e-9e01-4cc1-ba66-450c378b2b64")
        self.assertEqual(aLike.object_type, 'comment')
        
class FollowerTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
            
        Follower.objects.create(
            id = "5cdfd032-7d84-446f-9a60-c451212ad0a6",
            follower = authors[0],
            following = authors[1],
        )
        
    def testFollwerFollowwing(self):
        aFollower = Follower.objects.get(id="5cdfd032-7d84-446f-9a60-c451212ad0a6")
        self.assertEquals(str(aFollower.follower.id), "631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEquals(str(aFollower.following.id), "ca14e1e3-77ce-44e3-8529-85172744c45b")        
        
class FollowRequestTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        uuid_tests = [
            "631f3ebe-d976-4248-a808-db2442a22168",
            "ca14e1e3-77ce-44e3-8529-85172744c45b",
        ]
        authors = []

        for i in range(len(uuid_tests)):
            authors.append(Author.objects.create(
                username="Author User Name" + str(i),
                displayName="Author Display Name " + str(i),
                id=uuid_tests[i],
            ))
            
        FollowRequest.objects.create(
            id = "5cdfd032-7d84-446f-9a60-c451212ad0a6",
            sender = authors[0],
            receiver = authors[1],
        )
        
    def testFollwerFollowwing(self):
        aFollowRequest = FollowRequest.objects.get(id="5cdfd032-7d84-446f-9a60-c451212ad0a6")
        self.assertEquals(str(aFollowRequest.sender.id), "631f3ebe-d976-4248-a808-db2442a22168")
        self.assertEquals(str(aFollowRequest.receiver.id), "ca14e1e3-77ce-44e3-8529-85172744c45b")        
        
class InboxTest(APITestCase):
    @classmethod
    def setUpTestData(cls): 
        pass                 
              
    
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
