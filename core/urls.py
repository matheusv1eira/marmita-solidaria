from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import CustomLoginView  # View customizada de login

# Importe os seus ViewSets das respetivas apps quando estiverem prontos:
# from estoque.views import EstoqueViewSet
# from entregas.views import EntregaViewSet

# Router principal para ViewSets (API REST automática)
router = DefaultRouter()
# router.register(r'estoque', EstoqueViewSet, basename='estoque')
# router.register(r'entregas', EntregaViewSet, basename='entregas')

urlpatterns = [
    # Painel Administrativo nativo do Django
    path('admin/', admin.site.urls),
    
    # Rotas de Autenticação JWT
    path('api/auth/login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Rotas da app accounts (registo, listagem de utilizadores reais com CPF, telefone e foto)
    path('api/auth/', include('accounts.urls')),
    
    # Rotas geradas automaticamente pelo Router (Estoque e Entregas)
    path('api/', include(router.urls)),
]