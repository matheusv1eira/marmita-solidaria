from django.urls import path
from .views import RegisterView, CustomLoginView, UserListView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomLoginView.as_view(), name='auth_login'),
    path('users/', UserListView.as_view(), name='auth_user_list'),
]