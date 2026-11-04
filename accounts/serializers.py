import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'}
    )
    
    # Torna o CPF obrigatório e impede valores vazios ou nulos na origem
    cpf = serializers.CharField(
        required=True,
        allow_blank=False,
        allow_null=False,
        error_messages={
            'required': 'O campo CPF é de preenchimento obrigatório.',
            'blank': 'O CPF não pode estar em branco.'
        }
    )

    class Meta:
        model = User
        fields = (
            'id', 
            'username', 
            'email', 
            'password', 
            'first_name', 
            'account_type', 
            'cpf', 
            'phone', 
            'profile_image'
        )

    def validate_cpf(self, value):
        """
        Valida e limpa o CPF enviado no registo.
        Remove carateres especiais, verifica o tamanho e rejeita sequências inválidas.
        """
        if not value:
            raise serializers.ValidationError("O CPF é obrigatório.")

        # Remove tudo o que não for dígito (pontos, traços, etc.)
        cpf_limpo = re.sub(r'\D', '', value)

        # Verifica se tem exatamente 11 dígitos
        if len(cpf_limpo) != 11:
            raise serializers.ValidationError("O CPF deve conter exatamente 11 dígitos numéricos.")

        # Rejeita CPFs com todos os dígitos repetidos (ex: 111.111.111-11)
        if cpf_limpo == cpf_limpo[0] * 11:
            raise serializers.ValidationError("CPF inválido.")

        return cpf_limpo

    def create(self, validated_data):
        """
        Cria o utilizador de forma segura utilizando o gestor nativo create_user
        para garantir o hashing correto da password.
        """
        password = validated_data.pop('password', None)
        
        # Criação limpa do utilizador com todos os dados validados (incluindo o CPF limpo)
        user = User.objects.create_user(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
            
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
        # O super().validate(attrs) gera e valida os tokens 'access' e 'refresh'
        data = super().validate(attrs)
        
        # Adiciona de forma segura os dados do utilizador na resposta JSON do login
        data['account_type'] = getattr(self.user, 'account_type', 'beneficiario')
        data['first_name'] = getattr(self.user, 'first_name', '') or self.user.username
        data['email'] = getattr(self.user, 'email', '')
        data['cpf'] = getattr(self.user, 'cpf', '')
        data['phone'] = getattr(self.user, 'phone', '')
        data['profile_image'] = getattr(self.user, 'profile_image', '')
        
        return data


class UserSerializer(serializers.ModelSerializer):
    # Assegura que o CPF é tratado corretamente na serialização para a tabela administrativa
    cpf = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = (
            'id', 
            'username', 
            'email', 
            'first_name', 
            'account_type', 
            'cpf', 
            'phone', 
            'profile_image', 
            'is_active'
        )