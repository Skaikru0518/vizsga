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
]
