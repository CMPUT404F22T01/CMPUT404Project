from re import A
from django.shortcuts import render
from rest_framework import generics, mixins, response, status
from .models import Author
from .serializer import AuthorRegisterSerializer,GetAuthorSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

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
    serializer_class = GetAuthorSerializer 
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = GetAuthorSerializer(queryset, many=True)

        return response.Response(serializer.data)