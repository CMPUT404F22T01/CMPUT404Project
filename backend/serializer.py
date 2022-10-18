from re import A
from rest_framework import serializers
from .models import Author
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class AuthorRegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = Author
        fields = ('username', 'password', 'display_name', 'github_url')
         
    def create(self, validated_data):
        return Author.objects.create_user(**validated_data)


class LoginSerializer(TokenObtainPairSerializer):
 
    def validate(self, attrs):
        data =  super().validate(attrs)

        data['username'] = self.user.username
        data['id'] = self.user.id
        data['github_url'] = self.user.github_url
        data['display_name'] = self.user.display_name
 
        return data

class GetAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'
   
   