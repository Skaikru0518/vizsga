from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Book

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'is_active', 'date_joined']
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'is_active', 'date_joined']

class BookSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Book
        fields = "__all__"