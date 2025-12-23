from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book
from .serializer import BookSerializer, UserSerializer


# ============== AUTHENTICATION ==============
@extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "username": {"type": "string"},
                "password": {"type": "string"}
            },
            "required": ["username", "password"]
        }
    },
    responses={
        200: {
            "type": "object",
            "properties": {
                "access": {"type": "string"},
                "refresh": {"type": "string"},
                "user": {"type": "object"}
            }
        }
    },
    description="Login with username and password to get JWT tokens",
    tags=["Authentication"]
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """
    Login with username and password

    Returns access and refresh JWT tokens
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        }, status=status.HTTP_200_OK)

    return Response(
        {"error": "Invalid credentials"},
        status=status.HTTP_401_UNAUTHORIZED
    )


@extend_schema(
    request=UserSerializer,
    responses={201: UserSerializer},
    description="Register a new user",
    tags=["Authentication"]
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user

    Required fields: username, password, email
    Optional: first_name, last_name
    """
    serialized = UserSerializer(data=request.data)
    if serialized.is_valid():
        user = serialized.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)
    return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# ============== BOOKS ==============
@extend_schema(
    request=BookSerializer,
    responses={
        200: BookSerializer(many=True),
        201: BookSerializer
    },
    description="Get all books (GET) or create a new book (POST)",
    tags=["Books"]
)
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def bookList(request):
    """
    GET: List all books for the authenticated user
    POST: Create a new book (user is automatically assigned)
    """
    if request.method == "GET":
        allBooks = Book.objects.filter(user=request.user).order_by('author')
        serialized = BookSerializer(allBooks, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        serialized = BookSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save(user=request.user)
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=BookSerializer,
    responses={
        200: BookSerializer,
        204: None
    },
    description="Get, update (PATCH) or delete a specific book",
    tags=["Books"]
)
@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def bookDetail(request, bookId):
    """
    GET: Get a specific book
    PATCH: Update a book (partial update)
    DELETE: Delete a book
    """
    try:
        book = Book.objects.get(pk=bookId, user=request.user)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found or you don't have permission"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serialized = BookSerializer(book)
        return Response(serialized.data, status=status.HTTP_200_OK)

    if request.method == "PATCH":
        serialized = BookSerializer(book, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============== USER PROFILE ==============
@extend_schema(
    request=UserSerializer,
    responses={200: UserSerializer},
    description="Get or update the authenticated user's profile",
    tags=["User"]
)
@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def userProfile(request):
    """
    GET: Get current user's profile
    PATCH: Update user profile (username, email, first_name, last_name, password)
    """
    user = request.user

    if request.method == "GET":
        serialized = UserSerializer(user)
        return Response(serialized.data, status=status.HTTP_200_OK)

    if request.method == "PATCH":
        serialized = UserSerializer(user, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            # If password is in the request, hash it
            if 'password' in request.data:
                user.set_password(request.data['password'])
                user.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)
