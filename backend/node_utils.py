
from uuid import uuid4
import requests
from .models import Node, Author

# Functions to create

## Add all authors
def getRemoteContent():
    
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



    Author.objects.filter(host=node.host).delete()


    for authorObj in data["items"]:
        # clean data
        if not authorObj["host"].endswith("/"):
            authorObj["host"] += "/"
        # If exists, then update
        authorObj["displayName"] = authorObj["display_name"]
        del authorObj["display_name"]
        p = Author(
            username = "Foreign " + str(uuid4()), # Just putting a unique username, we wont need this ever, and it can't be null either
            displayName = authorObj["displayName"],
            url = authorObj["url"],
            host = authorObj["host"],
            profileImage = authorObj["profileImage"],
        )
        p.save()

# def updatePosts(node: Node):
#     pass


## Send post to foreign authors
## Send to friends
## Send friend request
## Send comment
