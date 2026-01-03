from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book, UserBook

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBook
        fields = ['id', 'user', 'book', 'bought', 'read', 'onBookshelf', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BookSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_mark = serializers.SerializerMethodField()

    # Make fields explicitly optional/required to handle both JSON and FormData
    isbn = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    genre = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cover = serializers.ImageField(required=False, allow_null=True)
    coverUrl = serializers.URLField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'isbn', 'genre', 'cover', 'coverUrl', 'user', 'user_mark']

    def get_user_mark(self, obj):
        """Return the current user's mark for this book, if any"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                user_book = UserBook.objects.get(user=request.user, book=obj)
                return {
                    'bought': user_book.bought,
                    'read': user_book.read,
                    'onBookshelf': user_book.onBookshelf
                }
            except UserBook.DoesNotExist:
                return None
        return None