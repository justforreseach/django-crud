from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db import connection
from django.core.exceptions import ValidationError
from .models import User
from .serializers import UserSerializer
import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class UserListCreateView(APIView):
    def get(self, request):
        try:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching users: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            logger.info(f"POST request received: {request.data}")
            
            username = request.data.get('username')
            if username and User.objects.filter(username=username).exists():
                return Response(
                    {'username': ['Username already exists.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                logger.info(f"User created successfully: {user.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.warning(f"Serializer validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_msg = str(e)
            if 'username' in error_msg.lower() and 'unique' in error_msg.lower():
                return Response(
                    {'username': ['Username already exists.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            logger.error(f"Error creating user: {error_msg}")
            return Response({'error': error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class UserDetailView(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        username = request.data.get('username')
        if username and User.objects.filter(username=username).exclude(pk=pk).exists():
            return Response(
                {'username': ['Username already exists.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        
        if User.objects.count() == 0:
            try:
                with connection.cursor() as cursor:
                    cursor.execute("ALTER TABLE users_user AUTO_INCREMENT = 1")
                logger.info("Auto-increment reset to 1 (table is empty)")
            except Exception as e:
                logger.error(f"Error resetting auto-increment: {str(e)}")
        
        return Response(status=status.HTTP_204_NO_CONTENT)

