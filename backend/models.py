from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from uuid import uuid4


class AuthorUserManager(BaseUserManager):
    def create_user(self, username, password=None, display_name=None, github_url=None, **other_fields):
        print("create user called")
        if not username:
            raise ValueError('username must not be empty')
        
        if not password:
            raise ValueError('password must not be empty')
        user = self.model(username=username, display_name=display_name, github_url=github_url, **other_fields)
        user.set_password(password)
        user.save()
        return user
 
    def create_superuser(self, username, password=None, **other_fields):
        other_fields.setdefault('is_active', 'True')
        other_fields.setdefault('is_staff', 'True')
        other_fields.setdefault('is_superuser', 'True')

        return self.create_user(username, password, **other_fields)


class Author(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=30, unique=True) 
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    join_date = models.DateTimeField(auto_now_add=True)
    profile_image = models.ImageField(null=True, blank=True)
    host = models.CharField(max_length=255, blank=True, default='http://127.0.0.1:8000/')
    profile_url = models.URLField(max_length=255, blank=True)
    github_url = models.URLField(max_length=255, blank=True, null=True)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    @property
    def type(self):
        return 'author' 

    @property
    def url(self):
        return self.host + "authors/" + str(self.id)

    objects = AuthorUserManager()
 

class POST(models.Model): 

    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64')
    )

    VISIBILITY_CHOICES = (
        ('PUBLIC','PUBLIC'),
        ("FRIENDS","FRIENDS")
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=255, blank=True, null=True)
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    contentType = models.CharField(max_length=255, choices=CONTENT_TYPE, default='text/plain')
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    image_url = models.URLField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    comment_count = models.IntegerField(default=0)
    published = models.DateTimeField(auto_now=True)
    visibility = models.CharField(max_length=15, choices=VISIBILITY_CHOICES, default="PUBLIC")
    unlisted = models.BooleanField(default=False)


    class Meta:
        ordering = ['-published']

    def __str__(self):
        return self.title

    @property
    def type(self):
        return 'post'

class Comment(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(POST, on_delete=models.CASCADE, null=True)
    comment = models.CharField(max_length=255)
    published = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published']
    
    def __str__(self):
        return self.author.username + '/' + self.post.title
         
    @property
    def type(self):
        return 'comment'

class Like(models.Model):

    TYPE_CHOICES = (
        ('post','post'),
        ("comment","comment")
    )

    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    object_type = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True)
    object_id = models.UUIDField(null=True) 
    published = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return 'like'

class Follower(models.Model):
    #sender
    follower = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='follower')
    #recevier
    following = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='following')
    # timestamp
    timestamp = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return 'friend'


class FollowRequest(models.Model):
    sender = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='receiver')
    timestamp = models.DateTimeField(auto_now_add=True)

    @property
    def type(self):
        return 'follow'


class Inbox(models.Model):

    TYPE_CHOICES = (
        ('post','post'),
        ("comment","comment"),
        ('like','like'),
        ("follow","follow")
    )

    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    object_type = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True )
    object_id = models.UUIDField(null=True)
    published = models.DateTimeField(auto_now_add=True)
