from re import A
from rest_framework import serializers
from . models import Author, Follower, Comment
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
    type = serializers.CharField()
    url = serializers.CharField()
    class Meta:
        model = Author
        fields = ["type","id","host","displayName","url","github","profileImage"]
   
class PostAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

class FollowerSerializer(serializers.ModelSerializer):

    follower = GetAuthorSerializer()
    class Meta:
        model = Follower
        fields = ["follower"]
        
class CommentSerializer(serializers.ModelSerializer):
    author = GetAuthorSerializer("author")
    class Meta:
        model = Comment
        fields = ["type", "author", "comment", "contentType", "published", "id"]