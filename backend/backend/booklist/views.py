from django.shortcuts import render, redirect

from . import forms
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Book
from .serializer import BookSerializer

# Create your views here.

def loginPage(request):
    loginform = forms.LoginForm()
    message = ""
    if request.method == "POST":
        loginform = forms.LoginForm(request.POST)
        if loginform.is_valid():
            user = authenticate(
                username = loginform.cleaned_data["username"],
                password = loginform.cleaned_data["password"],
            )
            if user is not None:
                login(request,user)
                return redirect("/")
            else:
                message = "Login failed!"
    context = {"loginform":loginform, "message":message}
    return render(request, "login.html", context)

@login_required
def homePage(request):
    return render(request, "index.html")

def logoutUser(request):
    logout(request)
    return redirect("/")

def registerPage(request):
    registerForm = forms.RegisterForm()
    context = {"registerform":registerForm}
    return render(request, "register.html", context)

def registerUser(request):
    if request.method == "POST":
        registerform = forms.RegisterForm(request.POST)
        if registerform.is_valid():
            _username = registerform.cleaned_data["username"]
            _password = registerform.cleaned_data["password"]
            _first_name = registerform.cleaned_data["first_name"]
            _last_name = registerform.cleaned_data["last_name"]
            _email = registerform.cleaned_data["email"]
            newUser = User(username = _username, first_name = _first_name, last_name = _last_name, email=_email)
            newUser.set_password(_password)
            newUser.save()
            return redirect("/")

@api_view(["GET","POST"])
def bookList(request):
    if request.method == "GET":
        allBooks = Book.objects.all().order_by('author')
        serialized = BookSerializer(allBooks, many = True)
        return Response(serialized.data)
    if request.method == "POST":
        serialized = BookSerializer(data = request.data)
        if serialized.is_valid():
            serialized.save(user=request.user)
            return Response(serialized.data, status.HTTP_201_CREATED)
        return Response(serialized.errors, status.HTTP_400_BAD_REQUEST)
    
@api_view(["DELETE"])
def deleteBook(request,bookId):
    if(request.method == "DELETE"):
        currentBook = Book.objects.get(pk=bookId)
        currentBook.delete()
        return Response(currentBook.data, status.HTTP_200_OK)