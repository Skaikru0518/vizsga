from django.urls import path
from . import views

app_name = "booklist"
urlpatterns = [
    path('', views.homePage, name="homepage"),
    path('login', views.loginPage, name="login"),
    path('logout', views.logoutUser, name="logout"),
    path('register_page', views.registerPage, name="registerPage"),
    path('register', views.registerUser, name="register"),
    path('books/', views.bookList, name="bookList"),
    path('delete/<int:bookId>/',views.deleteBook, name="deleteBook"),
]
