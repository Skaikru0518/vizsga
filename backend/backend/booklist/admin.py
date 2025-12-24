from django.contrib import admin

from .models import *

# Register your models here.

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
  list_display = ("title", "author", "genre", "user")
  list_filter = ("genre", "author")
  ordering = ("title",)
  search_fields = ("title", "author", "isbn")


@admin.register(UserBook)
class UserBookAdmin(admin.ModelAdmin):
  list_display = ("user", "book", "bought", "read", "onBookshelf", "created_at")
  list_filter = ("bought", "read", "onBookshelf", "created_at")
  ordering = ("-created_at",)
  search_fields = ("user__username", "book__title", "book__author")
  readonly_fields = ("created_at", "updated_at")