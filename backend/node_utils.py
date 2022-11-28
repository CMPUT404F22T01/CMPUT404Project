
from uuid import uuid4
import requests
from .models import Node, Author, POST, FollowRequest, Follower, Comment
from mainDB.settings import HOSTNAME
from .serializer import PostSerializer

# Functions to create

## Add all authors
def getRemoteContent():
    # Delete all old foreign authors
    Author.objects.exclude(host=HOSTNAME).exclude(host="https://c404t3.herokuapp.com/").delete()
    
    for node in Node.objects.all():
        if not node.currentlyConnected:
            continue
        # Update Authors
        updateAuthors(node)
        # Update posts
        # updatePosts(node)

def updateAuthors(node: Node):
    url = node.host + "authors/"
    username = node.username
    password = node.password
    if node.requiresAuth:
        auth = (username, password)
    else:
        auth = None
    data = requests.get(url, auth=auth)
    if data.status_code not in range(200, 300):
        print("Error")
        return
    data = data.json()

    for authorObj in data["items"]:
        # clean data
        if not authorObj["host"].endswith("/"):
            authorObj["host"] += "/"
        # If exists, then update
        if authorObj.get("display_name", False):
            authorObj["displayName"] = authorObj["display_name"]
            del authorObj["display_name"]
        p = Author(
            username = str(node.teamName) + "_" + str(authorObj["displayName"]), # Just putting a unique username, we wont need this ever, and it can't be null either
            displayName = authorObj["displayName"],
            url = authorObj["url"],
            host = authorObj["host"],
            profileImage = authorObj["profileImage"],
            node = node
        )
        p.save()

# def updatePosts(node: Node):
#     pass


## Send post to foreign authors
def sendPostToAllForeignAuthors(post: POST):
    """
    Used for sending public posts to all foreign authors inbox!
    """
    p = PostSerializer(post)
    allForeignAuthors = Author.objects.exclude(node=None, host=HOSTNAME)

    for author in allForeignAuthors:
        if not author.node.currentlyConnected:
            continue
        username = author.node.username
        password = author.node.password
        if author.node.requiresAuth:
            auth = (username, password)
        else:
            auth = None

        url = author.get_url() + "/inbox"
        print(url)



def sendPostToAllFriends(post: POST):
    """
    Used for sending all FRIENDS only posts to all the author's friends that are remote!
    """
    pass


def sendFriendRequest(sender: Author, reciever: Author):
    pass




## Send to friends
## Send friend request
## Send comment
