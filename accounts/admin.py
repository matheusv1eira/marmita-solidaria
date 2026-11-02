from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    # Adicionar os campos customizados nas listas de visualização do Django Admin
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Sociais', {'fields': ('account_type', 'cpf', 'phone', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informações Sociais', {'fields': ('account_type', 'cpf', 'phone', 'profile_image', 'email', 'first_name')}),
    )
    list_display = ('username', 'email', 'first_name', 'account_type', 'cpf', 'is_staff')
    list_filter = ('account_type', 'is_staff', 'is_active')