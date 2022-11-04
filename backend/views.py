from functools import partial
from re import A
import re
from django.shortcuts import render
from rest_framework import generics, mixins, response, status
from .models import *
from .serializer import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser


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

@api_view(["GET","PUT","POST","DELETE"])
@permission_classes([AllowAny])
def testAuth(request):
    print(request.method)
    print(request.user)
    print(request.user.is_authenticated)
    return response.Response(status=status.HTTP_200_OK)



class PostSingleDetailView(generics.RetrieveUpdateDestroyAPIView, generics.CreateAPIView):

    queryset = POST.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs): 
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        serializer = self.serializer_class(queryset, many=False) 
        return Response(serializer.data)

    def post(self, request, *args, **kwargs): 
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        serializer =  self.serializer_class(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, *args, **kwargs):
        print(request.method)
    

     

class PostMutipleDetailView(generics.ListCreateAPIView):

    queryset = POST.objects.all()
    serializer_class = PostSerializer
    # parser_classes = [MultiPartParser, FormParser]


    def get(self, request, *args, **kwargs):
        #author__ becoz the author is named author in the post model and serializer
        queryset = POST.objects.filter(author__id=kwargs['uuidOfAuthor'])
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    # adding extra data to context object becoz we need to author to create the post
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            #can also do get_obkect_or_404..
            context['author'] = Author.objects.filter(id=self.kwargs['uuidOfAuthor']).first()
        return context

    def post(self, request, format=None, *args, **kwargs):  
        return self.create(request, *args, **kwargs)
        

        

class PostImageView(generics.ListAPIView):
    pass