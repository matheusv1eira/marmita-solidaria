from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomLoginView  # <-- Importe a sua view customizada

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rota de Login customizada que retorna o account_type e first_name
    path('api/auth/login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    
    # Rota para renovar o token expirado
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rotas da app accounts (ex: registo)
    path('api/auth/', include('accounts.urls')),
]