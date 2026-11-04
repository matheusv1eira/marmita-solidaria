from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Modelo de Utilizador customizado para o sistema,
    suportando tipos de conta, CPF, telefone e imagem de perfil em Base64.
    """
    
    ACCOUNT_TYPES = (
        ('administrador', 'Administrador'),
        ('voluntario', 'Voluntário'),
        ('beneficiario', 'Beneficiário'),
    )

    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPES,
        default='beneficiario',
        verbose_name="Tipo de Conta",
        help_text="Define o nível de permissão e acesso do utilizador no sistema."
    )
    
    cpf = models.CharField(
        max_length=14,
        unique=True,
        null=True,
        blank=True,
        verbose_name="CPF",
        help_text="Registo de identificação fiscal (CPF)."
    )
    
    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Telefone / Telemóvel"
    )
    
    # Armazena a imagem da webcam capturada no cadastro (Data URL / Base64)
    profile_image = models.TextField(
        null=True,
        blank=True,
        verbose_name="Foto de Perfil (Base64)",
        help_text="String em Base64 da foto capturada pela câmara web durante o registo."
    )

    class Meta:
        verbose_name = "Utilizador"
        verbose_name_plural = "Utilizadores"
        ordering = ['-date_joined']

    def __str__(self):
        nome_exibicao = self.get_full_name() or self.username
        tipo_exibicao = self.get_account_type_display()
        return f"{nome_exibicao} ({tipo_exibicao})"