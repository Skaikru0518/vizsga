from django.db import models
from django.conf import settings
import os
from cuid import cuid

# Create your models here.

def book_cover_upload_path(instance, filename):
    """
    Generate a unique filename for uploaded book covers using CUID
    Format: images/cuid.ext
    """
    # Get the file extension
    ext = os.path.splitext(filename)[1]
    # Generate unique filename with CUID
    unique_filename = f"{cuid()}{ext}"
    return os.path.join('images', unique_filename)


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    description = models.TextField()
    isbn = models.CharField(max_length=13, blank=True, null=True)
    genre = models.CharField(max_length=50, blank=True, null=True)
    cover = models.ImageField(upload_to=book_cover_upload_path, null=True, blank=True)
    coverUrl = models.URLField(max_length=500, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_books')

    def __str__(self):
        return self.title


class UserBook(models.Model):
    """Kapcsolótábla: Melyik user melyik könyvet jelölte meg"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='marked_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='user_marks')
    bought = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    onBookshelf = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'book')
        verbose_name = 'User Book Mark'
        verbose_name_plural = 'User Book Marks'

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"