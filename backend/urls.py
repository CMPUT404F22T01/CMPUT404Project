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
    path('authors/<uuid:sender>/followers/<uuid:receiver>', views.handleFollowRequest), # TODO put in inbox

    # Post routes!
    path("posts/", views.getAllPosts), # Gets all posts (not required)
 

    # path("authors/<uuid:authorID>/posts/<uuid:postID>", views.handleUUIDPostRequest),
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
    #     GET [local, remote] get the public post converted to binary as an iamge
    #     return 404 if not an image
    #
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/image/', views.PostImageView.as_view()),

    # Comment routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments', views.CommentPostView.as_view()),

    # Like routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/likes', views.getAllPostLikes),
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments/<uuid:uuidOfComment>/likes', views.getAllCommentLikes),

    # Liked routes!
    path('authors/<uuid:uuidOfAuthor>/liked', views.getAllAuthorLiked),
    
    # Inbox routes!
    path("authors/<uuid:author_id>/inbox", views.handleInboxRequests),

    *router.urls,
]