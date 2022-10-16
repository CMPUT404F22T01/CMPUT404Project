from re import A
from rest_framework import serializers
from .models import Author


class AuthorRegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = Author
        fields = ('username', 'password', 'display_name', 'github_url')
         
    def create(self, validated_data):
        return Author.objects.create_user(**validated_data)
