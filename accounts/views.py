from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    Endpoint para o registo de novos utilizadores (beneficiários, voluntários ou administradores).
    Permite salvar dados como CPF, telefone, foto em Base64 e tipo de conta.
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class CustomLoginView(TokenObtainPairView):
    """
    Endpoint de Autenticação JWT Customizado.
    Retorna os tokens 'access' e 'refresh', além de dados úteis do utilizador logado.
    """
    serializer_class = CustomTokenObtainPairSerializer


class UserListView(generics.ListCreateAPIView):
    """
    Endpoint para Listar e Criar Utilizadores Reais.
    Resolve o erro 404 em /api/auth/users/ e alimenta a tabela administrativa do Next.js.
    """
    queryset = User.objects.all().order_by('-date_joined')
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer