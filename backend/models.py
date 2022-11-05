from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from uuid import uuid4

from mainDB.settings import HOSTNAME

def post_upload_to(instance, filename):
    return 'posts/{filename}'.format(filename=filename)

class AuthorUserManager(BaseUserManager):
    def create_user(self, username, password=None, displayName=None, github=None, **other_fields):
       
        if not username:
            raise ValueError('username must not be empty')
        
        if not password:
            raise ValueError('password must not be empty')
        user = self.model(username=username, displayName=displayName, github=github, **other_fields)
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
    profileImage = models.ImageField(null=True, blank=True)
    host = models.CharField(max_length=255, blank=True, default='http://127.0.0.1:8000/')
    url = models.URLField(max_length=255, blank=True)
    github = models.URLField(max_length=255, blank=True, null=True)
    displayName = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    @property
    def type(self):
        return 'author' 

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
        ("PUBLIC","PUBLIC"),
        ("FRIENDS","FRIENDS")
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.CharField(max_length=255, blank=True, null=True, default='No Title')
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(default=HOSTNAME)
    description = models.CharField(max_length=500, blank=True, null=True)
    contentType = models.CharField(max_length=255, choices=CONTENT_TYPE, default='text/plain')
    content = models.TextField(blank=True, null=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    categories = models.TextField(default='[]', null=True)
    image_url = models.URLField(null=True, blank=True)
    #upload_to is a function
    image = models.ImageField(upload_to=post_upload_to, null=True, blank=True)
    count = models.IntegerField(default=0)
    published = models.DateTimeField(auto_now=True)
    visibility = models.CharField(max_length=15, choices=VISIBILITY_CHOICES, default="PUBLIC")
    unlisted = models.BooleanField(default=False)

    def get_id(self):
        return self.origin + "authors/" + str(self.author.id) + "/posts/" + str(self.id)

    def get_source(self):
        source = str(self.source) if self.source is not None else HOSTNAME
        return source + "posts/" + str(self.id)

    def get_origin(self):
        return str(self.origin) + "posts/" + str(self.id)

    class Meta:
        ordering = ['-published']

    def __str__(self):
        return self.title

    @property
    def type(self):
        return 'post'

class Comment(models.Model):
    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain')
    )

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    post = models.ForeignKey(POST, on_delete=models.CASCADE, null=True)
    comment = models.CharField(max_length=255)
    published = models.DateTimeField(auto_now_add=True)
    contentType = models.CharField(max_length=255, choices=CONTENT_TYPE, default='text/markdown')
 
    class Meta:
        ordering = ['-published']
    
    def __str__(self):
        return self.author.username + '/' + self.post.title
         
    @property
    def type(self):
        return 'comment'
    
    def get_id(self):
        return self.post.origin + "authors/" + str(self.author.id) + "/posts/" + str(self.post.id) + "/comments/" + str(self.id)

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
        return 'Like'

    def summary(self):
        return self.author.displayName + " Likes your " + self.object_type

    def object_url(self):
        if self.object_type == "post":
            return POST.objects.get(id=self.object_id).get_id()
        elif self.object_type == "comment":
            return Comment.objects.get(id=self.object_id).get_id()

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
