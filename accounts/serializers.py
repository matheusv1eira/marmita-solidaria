from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'account_type', 'cpf')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            account_type=validated_data.get('account_type', 'beneficiario'),
            cpf=validated_data.get('cpf', '')
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Adiciona claims personalizados dentro do payload do token JWT
        token['username'] = user.username
        token['account_type'] = getattr(user, 'account_type', 'beneficiario')
        return token

    def validate(self, attrs):
        # O super().validate(attrs) já gera e popula os tokens 'access' e 'refresh'
        data = super().validate(attrs)
        
        # Adiciona de forma segura os dados extras do utilizador na resposta JSON
        data['account_type'] = getattr(self.user, 'account_type', 'beneficiario')
        data['first_name'] = getattr(self.user, 'first_name', '') or self.user.username
        data['email'] = getattr(self.user, 'email', '')
        
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'account_type', 'cpf', 'is_active')