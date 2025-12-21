from django import forms 

class LoginForm(forms.Form):
    username = forms.CharField(max_length=63)
    password = forms.CharField(max_length=63, widget=forms.PasswordInput)

class RegisterForm(forms.Form):
    username = forms.CharField(max_length=63, required=True)
    password = forms.CharField(max_length=63, widget=forms.PasswordInput, required=True)
    first_name = forms.CharField(max_length=63)
    last_name = forms.CharField(max_length=63)
    email = forms.EmailField(required=True)