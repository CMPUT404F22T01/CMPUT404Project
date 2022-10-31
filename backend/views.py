from functools import partial
import json
from re import A
import re
from django.shortcuts import render
from rest_framework import generics, mixins, response, status
from .models import *
from . serializer import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes

class AuthorCreate(
    generics.CreateAPIView
):

    # queryset = Author.objects.all()
    serializer_class = AuthorRegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAuthorData(generics.ListAPIView):

    queryset = Author.objects.all()
    # serializer_class = GetAuthorSerializer 
    # permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = GetAuthorSerializer(queryset, many=True)

        return response.Response(serializer.data)

@api_view(["GET"])
def getAllAuthors(request):
    allAuthors  = Author.objects.all()
    serializer = GetAuthorSerializer(allAuthors, many=True)
    resp = {
        "type": "authors",
        "items": serializer.data
    }
    return response.Response(resp)


@api_view(["GET", "POST"])
def getSingleAuthor(request, uuidOfAuthor):
    # Get single author
    singleAuthor = Author.objects.get(id=uuidOfAuthor)
    if request.method == "GET":
        serializer = GetAuthorSerializer(singleAuthor)
        return response.Response(serializer.data)
    # Update single author
    elif request.method == "POST":
        serializer =  PostAuthorSerializer(instance=singleAuthor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return response.Response(serializer.data)


@api_view(["GET","PUT","DELETE"])
def handleSingleFollow(request, authorID, foreignAuthor):
    
    if request.method == "GET":
        try:
            followObject = Follower.objects.get(follower__id=foreignAuthor, following__id=authorID)
            return response.Response({ "message": "Following relationship exists!"}, 200)
        except:
            return response.Response({ "message": "Following relationship does not exists!"}, 404)
    
    if request.method == "PUT":
        if not request.user.is_authenticated:
            return response.Response({"message":"Unauthorized"}, status.HTTP_401_UNAUTHORIZED)
        try:
            newFollowObj = Follower.objects.get_or_create(follower_id=foreignAuthor, following_id=authorID)
            return response.Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return response.Response(None)
    
    if request.method == "DELETE":
        try:
            followObj = Follower.objects.filter(follower__id=foreignAuthor, following__id=authorID).delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET","PUT","DELETE"])
def handleFollowRequest(request, sender, receiver):
    # Ensure that there is a follow request from sender to reciever
    if request.method == "GET":
        try:
            followReqObj = FollowRequest.objects.get(sender__id=sender, reciever__id=receiver)
            return response.Response({ "message": "Following relationship exists!"}, 200)
        except:
            return response.Response({ "message": "Following relationship does not exists!"}, 404)
    
    # Add follow request from sender to reciever
    if request.method == "PUT":
        try:
            newFollowReqObj = FollowRequest.objects.get_or_create(sender__id=sender, reciever__id=receiver)
            return response.Response(status=status.HTTP_201_CREATED)
        except:
            return response.Response(None)

    # Delete follow request from sender to reciever:
    if request.method == "DELETE":
        try:
            FollowRequest.objects.filter(sender__id=sender, reciever__id=receiver).delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def getAllPosts(request):
    posts = POST.objects.all()
    jsonData = PostSerializer(posts, many=True)
    return response.Response(jsonData.data, 200)

@api_view(["GET","POST","PUT","DELETE"])
def handleUUIDPostRequest(request, authorID, postID):
    # Get post
    if request.method == "GET":
        try:
            postObj = POST.objects.get(author__id=authorID, id=postID)
            jsonPost = PostSerializer(postObj)
            return response.Response(jsonPost.data, 200)
        except:
            return response.Response({ "message":"Post not found!"}, status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def getAllComments(request, uuidOfAuthor, uuidOfPost):
    # Get all comments of that post
    allComments = Comment.objects.filter(post__id=uuidOfPost)
    serializer = CommentSerializer(allComments, many=True)  
    ####### add post and id later ########
    resp = {
        "type": "comments",
        "comments": serializer.data,
    }
    return response.Response(resp)

@api_view(["GET"])
def getAllPostLikes(request, uuidOfAuthor, uuidOfPost):
    # Get all likes of that post
    allLikes = Like.objects.filter(object_id=uuidOfPost)
    serializer = LikeSerializer(allLikes, many=True)  

    itemArray = []
    
    for obj in serializer.data:
        itemArray.append({ 
                    "summary": obj["author"]['displayName'] + " Likes your post",
                    "type": "Like",
                    "author" : obj["author"],
                    "object" : str(request)}) ####### idk how to fix this - Moxil
        
    resp = {"items" : itemArray}  
    return response.Response(resp)

@api_view(["GET"])    
def getAllCommentLikes(request, uuidOfAuthor, uuidOfPost, uuidOfComment):
    # Get all likes of that comment
    allLikes = Like.objects.filter(object_id=uuidOfComment)
    serializer = LikeSerializer(allLikes, many=True)  
    itemArray = []
    
    for obj in serializer.data:
        itemArray.append({ 
                    "summary": obj["author"]['displayName'] + " Likes your comment",
                    "type": "Like",
                    "author" : obj["author"],
                    "object" : str(request)}) ####### idk how to fix this - Moxil
        
    resp = {"items" : itemArray}  
    return response.Response(resp)

@api_view(["GET"])
def getAllAuthorLiked(request, uuidOfAuthor):
    # Get everything that author liked
    allLikes = Like.objects.filter(author=uuidOfAuthor)
    serializer = LikeSerializer(allLikes, many=True)  
    itemArray = []
    
    for obj in serializer.data:
        itemArray.append({ 
                    "summary": obj["author"]['displayName'] + " Likes your "+ obj["object_type"],
                    "type": "Like",
                    "author" : obj["author"],
                    "object" : str(request)}) ####### idk how to fix this - Moxil
        
    resp = {"type":"liked", "items" : itemArray}  
    return response.Response(resp)

@api_view(["GET"])
def getAllFollowers(request, uuidOfAuthor):
    # Get multiple follower objects
    allFollowers = Follower.objects.filter(following__id=uuidOfAuthor)
    serializer = FollowerSerializer(allFollowers, many=True)
    resp = {
        "type": "followers",
        "items": [obj["follower"] for obj in serializer.data]
    }
    return response.Response(resp)



@api_view(["GET","PUT","POST","DELETE"])
@permission_classes([AllowAny])
def testAuth(request):
    print(request.method)
    print(request.user)
    print(request.user.is_authenticated)
    return response.Response(status=status.HTTP_200_OK)