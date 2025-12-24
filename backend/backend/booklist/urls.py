from django.urls import path
from . import views

app_name = "booklist"
urlpatterns = [
    # API Endpoints for React
    path('login/', views.login, name="login"),
    path('register/', views.register, name="register"),
    path('profile/', views.userProfile, name="userProfile"),
    path('books/', views.bookList, name="bookList"),
    path('books/<int:bookId>/', views.bookDetail, name="bookDetail"),
    path('books/<int:bookId>/mark/', views.bookMark, name="bookMark"),

    # Admin Endpoints (Superuser only)
    path('admin/users/', views.adminUserList, name="adminUserList"),
    path('admin/users/<int:userId>/', views.adminUserDetail, name="adminUserDetail"),
    path('admin/books/', views.adminBookList, name="adminBookList"),
    path('admin/books/<int:bookId>/', views.adminBookDetail, name="adminBookDetail"),
]
