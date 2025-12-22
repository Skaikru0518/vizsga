from django.contrib import admin

from .models import *

# Register your models here.

@admin.register(Book)
class Book(admin.ModelAdmin):
  list_display = ("title",)
  list_filter = ("title", "author")
  ordering = ("title",)