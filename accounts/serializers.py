from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

# 1. Serializer para o Registo de Novos Utilizadores
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_image = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cpf = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'phone', 'cpf', 'account_type', 'profile_image')

    def create(self, validated_data):
        profile_image = validated_data.pop('profile_image', None)
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        
        # Se guardar a imagem Base64 no perfil ou modelo, ajuste aqui conforme necessário
        if profile_image:
            setattr(user, 'profile_image', profile_image)
            
        user.save()
        return user


# 2. Serializer Customizada para o Login JWT (Envia o account_type e first_name)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Enviar dados adicionais na resposta do login
        data['account_type'] = getattr(self.user, 'account_type', 'beneficiario')
        data['first_name'] = self.user.first_name
        data['username'] = self.user.username
        
        return data