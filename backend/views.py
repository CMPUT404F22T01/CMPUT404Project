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

# @api_view(["GET"])
# def getAllComments(request, uuidOfAuthor, uuidOfPost):
#     # Get all comments of that post
#     allComments = Comment.objects.filter(post__id=uuidOfPost)
#     serializer = CommentSerializer(allComments, many=True)  
#     ####### add post and id later ########
#     resp = {
#         "type": "comments",
#         "comments": serializer.data,
#     }
#     return response.Response(resp)

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

     # adding extra data to context object becoz we need author(finding the correct author by uuid) to create the post
     # and we take in the user inputed uuid
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'PUT':
            #can also do get_object_or_404..
            context['author'] = Author.objects.filter(id=self.kwargs['uuidOfAuthor']).first()
            context['id'] = self.kwargs['uuidOfPost']
        return context

    '''
        Check if the current user is allowed to access that individual post
        check 1 if it is the post made by same author then return it or the post is public post
        check 2 if the author who made the request is the follower of the author who made the post
    '''
    def get(self, request, *args, **kwargs): 
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        print(queryset.author.id, kwargs['uuidOfAuthor'])
        if  (kwargs['uuidOfAuthor'] == queryset.author.id) or queryset.visibility == 'PUBLIC':
            serializer = self.serializer_class(queryset, many=False)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif  (queryset.visibility == 'FRIENDS') and bool(Follower.objects.filter(follower__id=kwargs['uuidOfAuthor'], following__id=queryset.author.id)): 
            serializer = self.serializer_class(queryset, many=False)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Error: Follower and Following relatioship does not exists"}, status=status.HTTP_400_BAD_REQUEST)

    '''
        Method says it is post but does the work of editing the post (no by choice but needed by requirements)
    '''
    def post(self, request, *args, **kwargs): 
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        serializer =  self.serializer_class(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    '''
        Creating new post based on uuid for post provided by the user
    '''
    def put(self, request, *args, **kwargs):
         return self.create(request, *args, **kwargs)
    
    '''
        Deleting a specified post
    '''
    def delete(self, request, *args, **kwargs):
         queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
         if queryset.author.id == kwargs['uuidOfAuthor']:
            queryset.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
         else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
         
    

     

class PostMutipleDetailView(generics.ListCreateAPIView):

    queryset = POST.objects.all()
    serializer_class = PostSerializer
    # parser_classes = [MultiPartParser, FormParser]


    '''
        Sends all the public post and post in which a relation of follower and follwoing exists between the authors
        all_post_objects has a list of all public and friend post after filtering the unlisted post
    '''
    def get(self, request, *args, **kwargs):
        #author__ becoz the author is named author in the post model and serializer
        # to get all author posts
        #author__id=kwargs['uuidOfAuthor']
        
        all_post_objects = []
        queryset = POST.objects.all().exclude(unlisted=True) 
        for obj in queryset:
             # adding  the all public post objects anf author self create post
            if (kwargs.get('uuidOfAuthor')) == obj.author.id or obj.visibility == 'PUBLIC':
                all_post_objects.append(obj)
            # if the connection does not exist then it is false or else true (so we add to post when connection exists)
            elif obj.visibility == 'FRIENDS' and bool(Follower.objects.filter(follower__id=kwargs['uuidOfAuthor'], following__id=obj.author.id)):
                all_post_objects.append(obj)
            
             
            
        serializer = self.serializer_class(all_post_objects, many=True)
        return Response(serializer.data)
    
    # adding extra data to context object becoz we need to author to create the post
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            #can also do get_object_or_404..
            context['author'] = Author.objects.filter(id=self.kwargs['uuidOfAuthor']).first()
       
        return context
    
    # by default does the same as this
    # def post(self, request, format=None, *args, **kwargs):  
    #     return self.create(request, *args, **kwargs) 
        

        

class PostImageView(generics.ListAPIView):
    pass


class CommentPostView(generics.ListCreateAPIView):

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    '''
        get the author object who will comment and pass it to serializer used later for creating comment object
        get the post object on which author will comment and pass it to serializer used later for creating comment object
        becoz comment has ForeignKey on both post and author therefore required feilds
    '''
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            context['author'] = Author.objects.filter(id=self.kwargs['uuidOfAuthor']).first()
            context['post'] = POST.objects.filter(id=self.kwargs.get('uuidOfPost')).first()

        return context

    '''
        stuff before the return self.create is only for incrementing the count in the post object by 1 becoz count is 
        number of comments on a particular post object
    '''
    def post(self, request, *args, **kwargs):
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        data = {'count' : queryset.count + 1} 
        serializer =  PostSerializer(queryset, data=data)
        if serializer.is_valid():
            serializer.save()
             
        return self.create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(author__id=kwargs['uuidOfAuthor'], post__id=kwargs['uuidOfPost'])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        