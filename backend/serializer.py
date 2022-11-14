from ast import mod
from pyexpat import model
from re import A
from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class AuthorRegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = Author
        fields = ('username', 'password', 'displayName', 'github')
         
    def create(self, validated_data):
        return Author.objects.create_user(**validated_data)


class LoginSerializer(TokenObtainPairSerializer):
 
    def validate(self, attrs):
        data =  super().validate(attrs)

        data['username'] = self.user.username
        data['id'] = self.user.id
        data['github'] = self.user.github
        data['displayName'] = self.user.displayName
 
        return data

class GetAuthorSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="url", read_only=True)
    type = serializers.CharField(read_only=True)
    url = serializers.CharField(read_only=True)
    displayName = serializers.CharField(allow_null=True)
    github = serializers.URLField(allow_blank=True, allow_null=True)
    class Meta:
        model = Author
        fields = ["type","id","host","displayName","url","github","profileImage", "username"]

class FollowerSerializer(serializers.ModelSerializer):
    follower = GetAuthorSerializer(read_only=True)
    class Meta:
        model = Follower
        fields = ["follower"]


class SingleFollowerSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField()
    follower = GetAuthorSerializer(read_only=True)
    following = GetAuthorSerializer(read_only=True)
    class Meta:
        model = Follower
        fields = ["id","follower","following","timestamp"]

class SingleFollowRequestSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField()
    sender = GetAuthorSerializer()
    receiver = GetAuthorSerializer()
    class Meta:
        model = FollowRequest
        fields = ["id","sender","receiver","timestamp"]

class PostSerializer(serializers.ModelSerializer):
    type = serializers.CharField(read_only=True)
    id = serializers.CharField(source="get_id", read_only=True)
    
    class Meta:
        model = POST
        fields = ["type", "id", "description"]


class CommentSerializer(serializers.ModelSerializer):
    author = GetAuthorSerializer("author", read_only=True)
    # this post is needed becoz i want to get the details about the post for sending a request in the inbox
    post = PostSerializer("post", read_only=True)
    id = serializers.CharField(source="get_id", read_only=True)
    class Meta:
        model = Comment
        fields = ["type", "author", "post", "comment", "contentType", "published", "id"]
    
    def create(self, validated_data):
        validated_data['author'] = self.context.get('author')
        validated_data['post'] = self.context.get('post') 
        return super().create(validated_data)


        
class LikeSerializer(serializers.ModelSerializer): 
    type = serializers.CharField(read_only=True)
    author = GetAuthorSerializer("author", read_only=True)
    # object = serializers.CharField(source="object_url") 
    class Meta:
        model = Like
        fields = ["type", "author", "object_id"] 
 
        
class PostSerializer(serializers.ModelSerializer):

    #Method 1
    type = serializers.SerializerMethodField()
    #method 2
    # type = serializers.ReadOnlyField(default=POST.type)
    # read_only equals to true becoz we don't want users to edit the author data while changing post data
    author = GetAuthorSerializer("author", read_only=True)
    id = serializers.CharField(source="get_id", read_only=True)
    class Meta:
        model = POST
        fields = "__all__"
    
    def get_type(self, obj):
        return obj.type

    #overding the default create method in the createAPI class
    def create(self, validated_data):
       #geeting author from the context we added it and adding to validated_data 

       #check becoz for put needs it and the post method in the other post view does not need the id becoz we 
       # have default id coming from the model when we create a new post
       if self.context.get('id') is not None:
            validated_data['id'] = self.context.get('id')
       validated_data['author'] = self.context.get('author')
       return super().create(validated_data)

class InboxSerializer(serializers.ModelSerializer):
    pass