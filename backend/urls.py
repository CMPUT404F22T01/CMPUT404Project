from django.urls import path 
from . import views
from .viewsets import LoginViewSet, RefreshTokenViewSet
from rest_framework_nested import routers



router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='auth_login')
router.register(r'refresh', RefreshTokenViewSet, basename='auth_refresh')

urlpatterns = [
    path('register/', views.AuthorCreate.as_view()),
    path('data/', views.testAuth),

    # Author routes!
    path('authors/', views.getAllAuthors), # TODO add pagination
    path('authors/<uuid:uuidOfAuthor>', views.getSingleAuthor),
    
    # Follower routes!
    path('authors/<uuid:uuidOfAuthor>/followers', views.getAllFollowers),
    path('authors/<uuid:authorID>/followers/<uuid:foreignAuthor>', views.handleSingleFollow),


    # Follow Request routes! (This is not specified in the description)
    ## path('authors/<uuid:sender>/followers/<uuid:reciever>', views.handleFollowRequest), -- This should send a follow req to reciever from sender. Also put in inbox!

    # Post routes!
    # URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}
    #     GET [local, remote] get the public post whose id is POST_ID
    #     POST [local] update the post whose id is POST_ID (must be authenticated)
    #     DELETE [local] remove the post whose id is POST_ID
    #     PUT [local] create a post where its id is POST_ID
    #
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/', views.PostSingleDetailView.as_view()),
 
    # Creation URL ://service/authors/{AUTHOR_ID}/posts/
    #     GET [local, remote] get the recent posts from author AUTHOR_ID (paginated)
    #     POST [local] create a new post but generate a new id
    #recent posts by the author
    path('authors/<uuid:uuidOfAuthor>/posts/', views.PostMutipleDetailView.as_view()),

    # Image Posts!
    # URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}/image
    #     GET [local, remote] get the public post converted to binary as an image
    #     return 404 if not an image
    #
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/image/', views.PostImageView.as_view()),

    # Comment routes!
    #     URL: ://service/authors/{AUTHOR_ID}/posts/{POST_ID}/comments
    # GET [local, remote] get the list of comments of the post whose id is POST_ID (paginated)
    # POST [local] if you post an object of “type”:”comment”, it will add your comment to the post whose id is POST_ID
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments', views.CommentPostView.as_view()), # TODO handle POST request

    # Like routes!
    # TODO double check moxils work here as he was confused on the objectIDs
    # URL: ://service/authors/{AUTHOR_ID}/inbox/
    #   POST [local, remote]: send a like object to AUTHOR_ID
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/likes', views.getAllPostLikes),
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments/<uuid:uuidOfComment>/likes', views.getAllCommentLikes),

    # Liked routes!
    path('authors/<uuid:uuidOfAuthor>/liked', views.getAllAuthorLiked),
    
    # Inbox routes!
    # URL: ://service/authors/{AUTHOR_ID}/inbox
    #     GET [local]: if authenticated get a list of posts sent to AUTHOR_ID (paginated)
    #     POST [local, remote]: send a post to the author
    #         if the type is “post” then add that post to AUTHOR_ID’s inbox
    #         if the type is “follow” then add that follow is added to AUTHOR_ID’s inbox to approve later
    #         if the type is “like” then add that like to AUTHOR_ID’s inbox
    #         if the type is “comment” then add that comment to AUTHOR_ID’s inbox
    #     DELETE [local]: clear the inbox

    *router.urls,
]