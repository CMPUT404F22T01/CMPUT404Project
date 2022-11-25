from . import utils
from django.shortcuts import render
from rest_framework import generics, mixins, response, status
from .models import *
from .serializer import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, OR
from .foreignServerPermission import ConnectedForeignServer, IsAuthenticatedORForeignServer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from . import node_utils as nu


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
    allAuthors = Author.objects.filter(host=HOSTNAME)
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
        serializer = GetAuthorSerializer(
            instance=singleAuthor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return response.Response(serializer.data)


@api_view(["GET", "PUT", "DELETE"])
def handleSingleFollow(request, authorID, foreignAuthor):

    if request.method == "GET":
        try:
            followObject = Follower.objects.get(
                follower__id=foreignAuthor, following__id=authorID)
            s = SingleFollowerSerializer(followObject)
            return response.Response(s.data, 200)
        except:
            return response.Response({"message": "Following relationship does not exists!"}, 404)

    if request.method == "PUT":
        try:
            if not request.user.is_authenticated:
                return response.Response({"message": "Unauthorized"}, status.HTTP_401_UNAUTHORIZED)

            newFollowObj = Follower.objects.get_or_create(
                follower_id=foreignAuthor, following_id=authorID)
            serializer = SingleFollowerSerializer(newFollowObj[0])
            Inbox.objects.create(author_id=foreignAuthor,
                                 object_type="following", object_id=authorID, message=f"{request.user.username} accepted your follow request.")
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        except:
            return response.Response({"message": "Following relationship does not exists!"}, 404)

    if request.method == "DELETE":
        try:
            followObj = Follower.objects.filter(
                follower__id=foreignAuthor, following__id=authorID).delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "PUT", "DELETE"])
def handleFollowRequest(request, sender, receiver):
    # Ensure that there is a follow request from sender to reciever
    if request.method == "GET":
        try:
            followReqObj = FollowRequest.objects.get(
                sender__id=sender, receiver__id=receiver)
            returnObj = SingleFollowRequestSerializer(followReqObj).data
            return response.Response(returnObj, 200)

        except:
            return response.Response({"message": "Following relationship does not exists!"}, 404)

    # Add follow request from sender to reciever
    if request.method == "PUT":
        try:
            newFollowReqObj = FollowRequest.objects.get_or_create(
                sender_id=sender, receiver_id=receiver)
            returnObj = SingleFollowRequestSerializer(newFollowReqObj[0])
            return response.Response(returnObj.data, status=status.HTTP_201_CREATED)
        except:
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Delete follow request from sender to reciever:
    if request.method == "DELETE":
        try:
            FollowRequest.objects.filter(
                sender__id=sender, receiver__id=receiver).delete()
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        except:
            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def getAllPostLikes(request, uuidOfAuthor, uuidOfPost):
    # Get all likes of that post
    allLikes = Like.objects.filter(object_id=uuidOfPost)
    serializer = LikeSerializer(allLikes, many=True)
    return response.Response(serializer.data)


@api_view(["GET"])
def getAllCommentLikes(request, uuidOfAuthor, uuidOfPost, uuidOfComment):
    # Get all likes of that comment
    allLikes = Like.objects.filter(object_id=uuidOfComment)
    serializer = LikeSerializer(allLikes, many=True)
    return response.Response(serializer.data)


@api_view(["GET"])
def getAllAuthorLiked(request, uuidOfAuthor):
    # Get everything that author liked
    allLikes = Like.objects.filter(author__id=uuidOfAuthor)
    serializer = LikeSerializer(allLikes, many=True)
    return response.Response(serializer.data)


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


@api_view(["GET", "PUT", "POST", "DELETE"])
@permission_classes([AllowAny])
def testAuth(request):
    resp = {
        "method": request.method,
        "user": str(request.user),
        "isAuthenticated": request.user.is_authenticated,
    }
    return response.Response(resp, status=status.HTTP_200_OK)


class PostSingleDetailView(generics.RetrieveUpdateDestroyAPIView, generics.CreateAPIView):

    queryset = POST.objects.all()
    serializer_class = PostSerializer

    # adding extra data to context object becoz we need author(finding the correct author by uuid) to create the post
    # and we take in the user inputed uuid
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'PUT':
            # can also do get_object_or_404..
            context['author'] = Author.objects.filter(
                id=self.kwargs['uuidOfAuthor']).first()
            context['id'] = self.kwargs['uuidOfPost']
        return context

    '''
        Check if the current user is allowed to access that individual post
        check 1 if it is the post made by same author then return it or the post is public post
        check 2 if the author who made the request is the follower of the author who made the post
    '''

    def get(self, request, *args, **kwargs):
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()

        if (kwargs['uuidOfAuthor'] == queryset.author.id) or queryset.visibility == 'PUBLIC':
            serializer = self.serializer_class(queryset, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif (queryset.visibility == 'FRIENDS') and bool(Follower.objects.filter(follower__id=kwargs['uuidOfAuthor'], following__id=queryset.author.id)):
            serializer = self.serializer_class(queryset, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"Error: Follower and Following relatioship does not exists"}, status=status.HTTP_400_BAD_REQUEST)

    '''
        Method says it is post but does the work of editing the post (no by choice but needed by requirements)
    '''

    def post(self, request, *args, **kwargs):
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        serializer = self.serializer_class(queryset, data=request.data)
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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, *args, **kwargs):
        queryset = POST.objects.filter(author__id=kwargs['uuidOfAuthor'])
        serializer = self.serializer_class(queryset, many=True)
        data = {
            "type" : "post",
            "items": serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

    # adding extra data to context object becoz we need to author to create the post

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            # can also do get_object_or_404..
            context['author'] = Author.objects.filter(
                id=self.kwargs['uuidOfAuthor']).first()
        return context

    # by default does the same as this
    # def post(self, request, format=None, *args, **kwargs):
    #     return self.create(request, *args, **kwargs)


class PostDistinctView(generics.ListAPIView):

    queryset = POST.objects.all()
    serializer_class = PostSerializer

    '''
           Sends all the public post and post in which a relation of follower and follwoing exists between the authors
           all_post_objects has a list of all public and friend post after filtering the unlisted post

           Cannot do image encoding here becoz broweser compalian about large files
       '''

    def get(self, request, *args, **kwargs):
        # author__ becoz the author is named author in the post model and serializer
        # to get all author posts
        # author__id=kwargs['uuidOfAuthor']

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
        data = {
            "type": 'post',
            "items": serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)


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
            context['author'] = Author.objects.filter(
                id=self.kwargs['uuidOfAuthor']).first()
            context['post'] = POST.objects.filter(
                id=self.kwargs.get('uuidOfPost')).first()

        return context

    '''
        stuff before the return self.create is only for incrementing the count in the post object by 1 becoz count is
        number of comments on a particular post object
    '''

    def post(self, request, *args, **kwargs):
        queryset = POST.objects.filter(id=kwargs['uuidOfPost']).first()
        data = {'count': queryset.count + 1}
        serializer = PostSerializer(queryset, data=data)
        if serializer.is_valid():
            serializer.save()

        return self.create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # edit
        queryset = self.get_queryset().filter(post__id=kwargs['uuidOfPost'])
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "type":"comments",
            "post": serializer.data[0]["post"]["id"],
            "id": serializer.data[0]["post"]["id"] +"/comments",
            "comments": []
        }
   
        for x in serializer.data:
            temp = {}
            for key,item in x.items():
                if(key != "type" and key != "post"):
                     temp[key] = item
            data["comments"].append(temp)
 
        return Response(data, status=status.HTTP_200_OK)


@api_view(["GET", "POST", "DELETE"])
# @permission_classes([IsAuthenticated])
def handleInboxRequests(request, author_id):

    request.user = Author.objects.get(id=author_id)

    if request.method == "GET":
        try:
            # Auth check
            # if not request.user.is_authenticated or request.user.id != author_id:
            #     return response.Response({"message": "Unauthenticated!"}, status.HTTP_401_UNAUTHORIZED)
            # Retrieve all posts
            allPostIDsInThisAuthorsInbox = Inbox.objects.filter(
                author__id=author_id, object_type="post")
            setOfIds = set([o.object_id for o in allPostIDsInThisAuthorsInbox])
            allPosts = POST.objects.filter(id__in=setOfIds)
            items = PostSerializer(allPosts, many=True)
            resp = {
                "type": "inbox",
                "author": request.user.get_url(),
                "items": items.data
            }
            return response.Response(resp, 200)
        except:
            return response.Response({"message": "Something went wrong!"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == "POST":
        try:
            try:
                message = "None"
                postType = str(request.data["type"]).lower()
                if not postType in {"post", "comment", "like", "follow", "share"}:
                    raise KeyError("Invalid post type!")
                if postType == "like":

                    data = {
                        "object_type": request.data["data"]["type"],
                        "author": request.data["data"]["author"],
                        "object_id": request.data["data"]["id"],
                    }
                    serializer = LikeSerializer(
                        data=data, partial=True)
                    if not serializer.is_valid(raise_exception=True):
                        raise KeyError("like object not valid!")

                    authorID, postID, commentID = utils.getAuthorIDandPostIDFromLikeURL(
                        serializer.data["object_id"])

                    if authorID != None and postID != None and commentID != None:
                        message = f'{request.user.username} liked your comment {request.data["data"]["comment"]}'
                        l = Like.objects.get_or_create(
                            author_id=request.user.id, object_type="comment", object_id=commentID)
                    elif authorID != None and postID != None:
                        message = f'{request.user.username} liked your post {request.data["data"]["title"]}'
                        l = Like.objects.get_or_create(
                            author_id=request.user.id, object_type="post", object_id=postID)
                    else:
                        raise KeyError("like object not valid!")
                    idOfItem = l[0].id

                else:
                    idOfItem = utils.getUUID(request.data["id"])
                    type = request.data["type"].lower()

                    if type == "comment":
                        message = f'{request.data["author"]["username"]}  commented on your post'
                    elif type == "post":
                        message = f'{request.data["author"]["username"]} added a new post {request.data["title"]}'
                    elif type == "share":
                        message = f'{request.GET.get("username")} shared a post with you.'
                        postType = 'post'
                    elif type == "follow":
                        message = f'{request.data["username"]} send you a follow request.'
                        print(idOfItem)
                Inbox.objects.create(author_id=author_id,
                                     object_type=postType, object_id=idOfItem, message=message)
                return response.Response({"message": message}, status.HTTP_201_CREATED)
            except Exception as e:
                return response.Response({"message": str(e)}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return response.Response({"message": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == "DELETE":
        try:
            Inbox.objects.filter(author__id=author_id).delete()
            return response.Response({"message": "Inbox cleared!"}, status.HTTP_200_OK)
        except:
            return response.Response({"message": "Something went wrong!"}, status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def getEntireInboxRequests(request, author_id):
    if request.method == "GET":
        try:
            # Auth check
            if request.user.id != author_id:
                return response.Response({"message": "Can't retreive someone else's inbox!"}, status.HTTP_401_UNAUTHORIZED)
            # Get inbox
            inboxObjects = Inbox.objects.filter(author__id=author_id)

            # Make return object!

            def helperFunc(obj: Inbox):
                serializerClass = None
                objectToSerialize = None
                data = None
                if obj.object_type == "post":
                    objectToSerialize = POST.objects.get(id=obj.object_id)
                    serializerClass = PostSerializer
                elif obj.object_type == "comment":
                    objectToSerialize = Comment.objects.get(id=obj.object_id)
                    serializerClass = CommentSerializer
                elif obj.object_type == "like":
                    objectToSerialize = Like.objects.get(id=obj.object_id)
                    serializerClass = LikeSerializer
                elif obj.object_type == "follow":
                    objectToSerialize = Author.objects.get(id=obj.object_id)
                    serializerClass = GetAuthorSerializer
                if objectToSerialize is None and obj.object_type == "following":
                    # "authors/" becoz in the frontent we split at authors/ for id
                    # sending the id of the person who accepted the follow request becoz
                    # in the frontend we can link to the redirect to profile on click
                    data = {"type": "follow",
                            "author" : { "id" : "authors/"+str(obj.object_id)}
                            }
                else:
                    s = serializerClass(objectToSerialize)

                return {"data": data or s.data, "message": obj.message}

            items = list(map(helperFunc, inboxObjects))
            resp = {
                "type": "inbox",
                "author": request.user.url(),
                "items": items,
            }
            return response.Response(resp, 200)

        except Exception as e:
            return response.Response({"message": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    if request.method == "DELETE":
        print(request.data)
        id = utils.getUUID(request.data["id"])
        try:
            Inbox.objects.filter(author__id=author_id, object_id=id).delete()
            return response.Response({"message": "Inbox cleared!"}, status.HTTP_204_NO_CONTENT)
        except:
            return response.Response({"message": "Something went wrong!"}, status.HTTP_500_INTERNAL_SERVER_ERROR)


class AuthorSearchView(generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = GetAuthorSerializer

    def list(self, request, *args, **kwargs):
        queryset = Author.objects.filter(
            username__icontains=request.GET.get('username'))
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(["GET"])
def update(request):
    nu.getRemoteContent()
    return response.Response(None, 200)

@api_view(["GET"])
# @permission_classes([IsAuthenticatedORForeignServer])
def functiontester(request):
    
    # u = UUID("f2136e19-65e8-43aa-8d45-c5072babc0b7")
    # post = POST.objects.get(id=u)
    # nu.sendPostToAllForeignAuthors(post)
    print(request.user, request.user.is_authenticated)
    return response.Response(None, 200)

class GetAllNodeUsers(generics.ListAPIView):

    serializer_class = GetAuthorSerializer
    queryset = Author.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = Author.objects.exclude(node=None)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, 200)
