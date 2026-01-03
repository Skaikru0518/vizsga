from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Book, UserBook
from .serializer import BookSerializer, UserSerializer, UserBookSerializer


# Custom permission for superusers only
class IsSuperUser(BasePermission):
    """
    Allow access only to superusers.
    """
    message = "Insufficient permissions"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser


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

    # Check if user exists and is inactive before authenticating
    try:
        user_obj = User.objects.get(username=username)
        if not user_obj.is_active:
            return Response(
                {"error": "Account deactivated, please contact administrators"},
                status=status.HTTP_403_FORBIDDEN
            )
    except User.DoesNotExist:
        pass  # User doesn't exist, will be caught by authenticate()

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


@extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "old_password": {"type": "string"},
                "new_password": {"type": "string"}
            },
            "required": ["old_password", "new_password"]
        }
    },
    responses={
        200: {
            "type": "object",
            "properties": {
                "message": {"type": "string"}
            }
        },
        400: {
            "type": "object",
            "properties": {
                "error": {"type": "string"}
            }
        }
    },
    description="Change password for authenticated user",
    tags=["Authentication"]
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    """
    Change password for the authenticated user

    Required fields: old_password, new_password
    """
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    if not old_password or not new_password:
        return Response(
            {"error": "Both old_password and new_password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verify old password
    if not request.user.check_password(old_password):
        return Response(
            {"error": "Old password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate new password length
    if len(new_password) < 8:
        return Response(
            {"error": "New password must be at least 8 characters long"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Set new password
    request.user.set_password(new_password)
    request.user.save()

    return Response(
        {"message": "Password changed successfully"},
        status=status.HTTP_200_OK
    )


# ============== BOOKS ==============
@extend_schema(
    request=BookSerializer,
    responses={
        200: BookSerializer(many=True),
        201: BookSerializer
    },
    description="Get all books from all users (GET) or create a new book (POST - requires authentication)",
    tags=["Books"]
)
@api_view(["GET", "POST"])
@permission_classes([AllowAny])  # GET is public, POST will check authentication manually
def bookList(request):
    """
    GET: List all books from all users (public access)
    POST: Create a new book (requires authentication, user is automatically assigned)
    """
    if request.method == "GET":
        # Public access - return all books with user_mark for authenticated users
        allBooks = Book.objects.all().order_by('author')
        serialized = BookSerializer(allBooks, many=True, context={'request': request})
        return Response(serialized.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        # Only authenticated users can create books
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required to create books"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serialized = BookSerializer(data=request.data, context={'request': request})
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
    description="Get (public), update (owner only) or delete (owner only) a specific book",
    tags=["Books"]
)
@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([AllowAny])  # GET is public, PATCH/DELETE check ownership
def bookDetail(request, bookId):
    """
    GET: Get a specific book (public access)
    PATCH: Update a book (only book owner)
    DELETE: Delete a book (only book owner)
    """
    try:
        book = Book.objects.get(pk=bookId)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        serialized = BookSerializer(book, context={'request': request})
        return Response(serialized.data, status=status.HTTP_200_OK)

    # PATCH and DELETE require ownership
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if book.user != request.user:
        return Response(
            {"error": "You don't have permission to modify this book"},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == "PATCH":
        serialized = BookSerializer(book, data=request.data, partial=True, context={'request': request})
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


# ============== ADMIN - USERS ==============
@extend_schema(
    responses={200: UserSerializer(many=True)},
    description="[ADMIN ONLY] Get all users in the system",
    tags=["Admin"]
)
@api_view(["GET"])
@permission_classes([IsSuperUser])
def adminUserList(request):
    """
    [ADMIN ONLY] List all users

    Requires: is_superuser=True
    """
    users = User.objects.all().order_by('username')
    serialized = UserSerializer(users, many=True)
    return Response(serialized.data, status=status.HTTP_200_OK)


@extend_schema(
    request=UserSerializer,
    responses={
        200: UserSerializer,
        204: None
    },
    description="[ADMIN ONLY] Update or delete a specific user by ID",
    tags=["Admin"]
)
@api_view(["PATCH", "DELETE"])
@permission_classes([IsSuperUser])
def adminUserDetail(request, userId):
    """
    [ADMIN ONLY] Update or delete a user by ID

    PATCH: Update user (partial update)
    DELETE: Delete user

    Requires: is_superuser=True
    """
    try:
        user = User.objects.get(pk=userId)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

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

    if request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============== ADMIN - BOOKS ==============
@extend_schema(
    request=BookSerializer,
    responses={
        200: BookSerializer(many=True),
        201: BookSerializer
    },
    description="[ADMIN ONLY] Get all books (GET) or create a book for any user (POST)",
    tags=["Admin"]
)
@api_view(["GET", "POST"])
@permission_classes([IsSuperUser])
def adminBookList(request):
    """
    [ADMIN ONLY] List all books from all users or create a book

    GET: List all books from all users
    POST: Create a book (user ID must be provided in request body)

    Requires: is_superuser=True
    """
    if request.method == "GET":
        books = Book.objects.all().order_by('author')
        serialized = BookSerializer(books, many=True)
        return Response(serialized.data, status=status.HTTP_200_OK)

    if request.method == "POST":
        # Admin can specify the user ID
        user_id = request.data.get('user')
        if not user_id:
            return Response(
                {"error": "user field is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serialized = BookSerializer(data=request.data)
        if serialized.is_valid():
            serialized.save(user=user)
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=BookSerializer,
    responses={
        200: BookSerializer,
        204: None
    },
    description="[ADMIN ONLY] Update or delete a specific book by ID",
    tags=["Admin"]
)
@api_view(["PATCH", "DELETE"])
@permission_classes([IsSuperUser])
def adminBookDetail(request, bookId):
    """
    [ADMIN ONLY] Update or delete a book by ID

    PATCH: Update book (partial update)
    DELETE: Delete book

    Requires: is_superuser=True
    """
    try:
        book = Book.objects.get(pk=bookId)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "PATCH":
        serialized = BookSerializer(book, data=request.data, partial=True)
        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_200_OK)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == "DELETE":
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============== USER BOOK MARKS ==============
@extend_schema(
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "bought": {"type": "boolean"},
                "read": {"type": "boolean"},
                "onBookshelf": {"type": "boolean"}
            }
        }
    },
    responses={
        200: {
            "type": "object",
            "properties": {
                "bought": {"type": "boolean"},
                "read": {"type": "boolean"},
                "onBookshelf": {"type": "boolean"}
            }
        },
        201: {
            "type": "object",
            "properties": {
                "bought": {"type": "boolean"},
                "read": {"type": "boolean"},
                "onBookshelf": {"type": "boolean"}
            }
        }
    },
    description="Mark a book (POST/PATCH) or remove mark (DELETE) - requires authentication",
    tags=["Book Marks"]
)
@api_view(["POST", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def bookMark(request, bookId):
    """
    POST: Mark a book (bought/read/onBookshelf)
    PATCH: Update existing mark
    DELETE: Remove mark
    """
    try:
        book = Book.objects.get(pk=bookId)
    except Book.DoesNotExist:
        return Response(
            {"error": "Book not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "POST":
        # Create or get existing mark
        user_book, created = UserBook.objects.get_or_create(
            user=request.user,
            book=book,
            defaults={
                'bought': request.data.get('bought', False),
                'read': request.data.get('read', False),
                'onBookshelf': request.data.get('onBookshelf', False)
            }
        )

        if not created:
            # If already exists, update it
            user_book.bought = request.data.get('bought', user_book.bought)
            user_book.read = request.data.get('read', user_book.read)
            user_book.onBookshelf = request.data.get('onBookshelf', user_book.onBookshelf)
            user_book.save()

        return Response({
            'bought': user_book.bought,
            'read': user_book.read,
            'onBookshelf': user_book.onBookshelf
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    if request.method == "PATCH":
        try:
            user_book = UserBook.objects.get(user=request.user, book=book)
        except UserBook.DoesNotExist:
            return Response(
                {"error": "Mark not found. Use POST to create one."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update only provided fields
        if 'bought' in request.data:
            user_book.bought = request.data['bought']
        if 'read' in request.data:
            user_book.read = request.data['read']
        if 'onBookshelf' in request.data:
            user_book.onBookshelf = request.data['onBookshelf']

        user_book.save()

        return Response({
            'bought': user_book.bought,
            'read': user_book.read,
            'onBookshelf': user_book.onBookshelf
        }, status=status.HTTP_200_OK)

    if request.method == "DELETE":
        try:
            user_book = UserBook.objects.get(user=request.user, book=book)
            user_book.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserBook.DoesNotExist:
            return Response(
                {"error": "Mark not found"},
                status=status.HTTP_404_NOT_FOUND
            )
