
from rest_framework.permissions import BasePermission, OR, IsAuthenticated
from rest_framework.request import Request
import base64
from .models import Node
from urllib.parse import urlparse 

class ForeignUser:
    def __init__(self) -> None:
        self.is_authenticated = True
    def __str__(self) -> str:
        return "ForeignNode"

def isForeignAuth(request):
    try:
        # Extract username password
        basic_auth_field = request.META['HTTP_AUTHORIZATION']
        basic_auth_base64 = basic_auth_field.split("Basic ")[1]
        basic_auth_bytes = base64.b64decode(basic_auth_base64) 
        username, password = basic_auth_bytes.decode('utf-8').split(":")
        
        # Check with our connected nodes if they are the same!
        if Node.objects.filter(username=username, password=password).exists():
            request.user = ForeignUser()
            return True
        
        # Check if something exists where no need for auth
        requestAddr = request.META['REMOTE_ADDR']
        if Node.objects.filter(host__icontains=requestAddr, requiresAuth=True).exists():
            return True
        
        # Else nothing matches, so return False
        return False

    except:
        return False

class ConnectedForeignServer(BasePermission):
    """
    Only allows access to servers which are registered and connected.
    Furthermore, it will ensure that they have provided the correct auth credentials.
    """
    def has_permission(self, request: Request, view):
        return isForeignAuth(request)
        

class IsAuthenticatedORForeignServer(BasePermission):
    def has_permission(self, request, view):
        return (
            IsAuthenticated.has_permission(self,request, view) or
            ConnectedForeignServer.has_permission(self,request, view)
        )