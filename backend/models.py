from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from uuid import uuid4


class AuthorUserManager(BaseUserManager):
    def create_user(self, username, password=None, display_name=None, github_url=None, **other_fields):
        print("cretae user called")
        if not username:
            raise ValueError('username must not be empty')
        
        if not password:
            raise ValueError('password must not be empty')
        # if not id:
        id = "http://127.0.0.1:8000/"+"authors/"+str(uuid4())
        user = self.model(username=username, id=id, display_name=display_name, github_url=github_url, **other_fields)
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
    id = models.URLField(primary_key=True)
    join_date = models.DateField(default=timezone.now)
    profile_image = models.ImageField(null=True, blank=True)
    host = models.CharField(max_length=255, blank=True, default='/')
    profile_url = models.URLField(max_length=255, blank=True)
    github_url = models.URLField(max_length=255, blank=True, null=True)
    display_name = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'username'
    # REQUIRED_FIELDS = ['first_name', 'last_name']


    def __str__(self):
        return self.username

    @property
    def type(self):
        return 'authors' 

    objects = AuthorUserManager()
 

class POST(models.Model): 

    CONTENT_TYPE = (
        ('text/markdown', 'text/markdown'),
        ('text/plain','text/plain'),
        ('application/base64', 'application/base64'),
        ('image/png;base64','image/png;base64'),
        ('image/jpeg;base64','image/jpeg;base64')
    )

    id = models.URLField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    source = models.URLField(null=True, blank=True)
    origin = models.URLField(null=True, blank=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    contentType = models.CharField(max_length=255, choices=CONTENT_TYPE, default='text/plain')
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    image_url = models.URLField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    # categories = 
    count = models.IntegerField(default=0)
    # comment = models.URLField()
    #commentsSrc = models.ForeignKey(Comment, on_delete=models.CASCADE)
    published = models.DateTimeField(default = timezone.now())
    # visibility = models.(default=)
    unlisted = models.BooleanField(default=False)


    class Meta:
        ordering = ['-published']

    def __str__(self):
        return self.title

    @property
    def type(self):
        return 'post'

class Comment(models.Model):

    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    post = models.ForeignKey(POST, on_delete=models.CASCADE, null=True)
    published = models.DateTimeField(default = timezone.now())
    id = models.URLField(primary_key=True)

    class Meta:
        ordering = ['-published']
    
    def __str__(self):
        return self.author.username + '/' + self.post.title 
    @property
    def type(self):
        return 'comment'

class Like(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    object = models.URLField(blank=True)


    @property
    def type(self):
        return 'like'

class Friend(models.Model):
    #related name becoz we have same foreign key i.e table
    summary = models.CharField(max_length=255, blank=True, null=True)
    #sender
    actor = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='sender')
    #recevier
    object = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='receiver')


    @property
    def type(self):
        return 'follow'
