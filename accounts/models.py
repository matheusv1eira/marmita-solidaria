from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Opções permitidas para o tipo de conta no sistema
    ACCOUNT_TYPES = (
        ('administrador', 'Administrador'),
        ('voluntario', 'Voluntário'),
        ('beneficiario', 'Beneficiário'),
    )

    account_type = models.CharField(
        max_length=20, 
        choices=ACCOUNT_TYPES, 
        default='beneficiario',
        verbose_name="Tipo de Conta"
    )
    
    cpf = models.CharField(
        max_length=14, 
        unique=True, 
        null=True, 
        blank=True,
        verbose_name="CPF"
    )
    
    phone = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        verbose_name="Telefone / Telemóvel"
    )
    
    # Como a webcam envia a imagem em formato Base64 (Data URL), usamos TextField para armazená-la com segurança
    profile_image = models.TextField(
        null=True, 
        blank=True,
        verbose_name="Foto de Perfil (Base64)"
    )

    def __str__(self):
        return f"{self.username} ({self.account_type})"