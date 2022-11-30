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
    path('authors/<uuid:uuidOfAuthor>/', views.getSingleAuthor),

    #search author routes
    path('author/search/', views.AuthorSearchView.as_view()), 
    
    # Follower routes!
    path('authors/<uuid:uuidOfAuthor>/followers/', views.getAllFollowers),
    path('authors/<uuid:authorID>/followers/<uuid:foreignAuthor>', views.handleSingleFollow),

    # Follow Request routes! (This is not specified in the description)
    path('authors/<uuid:sender>/followrequest/<uuid:receiver>', views.handleFollowRequest), # -- This should send a follow req to reciever from sender. Also put in inbox!

    # Post routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>', views.PostSingleDetailView.as_view()),
 
    # Creation URL ://service/authors/{AUTHOR_ID}/posts/
    path('authors/<uuid:uuidOfAuthor>/posts/', views.PostMutipleDetailView.as_view()),
    path('authors/<uuid:uuidOfAuthor>/posts/distinct/', views.PostDistinctView.as_view()),

    # Image Posts!
    # path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/image/', views.PostImageView.as_view()),

    # Comment routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments/', views.CommentPostView.as_view()),

    # Like routes!
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/likes/', views.getAllPostLikes),
    path('authors/<uuid:uuidOfAuthor>/posts/<uuid:uuidOfPost>/comments/<uuid:uuidOfComment>/likes/', views.getAllCommentLikes),

    # Liked routes!
    path('authors/<uuid:uuidOfAuthor>/liked/', views.getAllAuthorLiked),
    
    # Inbox routes!
    path("authors/<uuid:author_id>/inbox/", views.handleInboxRequests),

    # Inbox route to get everything (not only posts!)
    path("authors/<uuid:author_id>/inboxAll/", views.getEntireInboxRequests),
    # path("authors/<uuid:uuidOfAuthor>/post/<uuid:uuidOfPostOrComment>/like/", views.CheckIfPostLikeExists.as_view()),
    # path("authors/<uuid:uuidOfAuthor>/comment/<uuid:uuidOfComment>/like/")

    #all node users,
    path('authors/<uuid:author_id>/nodes/', views.GetAllNodeUsers.as_view()),

    *router.urls,


    ## Maintenence routes
    path("update/", views.update),
    path("test/", views.functiontester),

]