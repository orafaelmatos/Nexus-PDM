import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from apps.projects.models import Project

class Invitation(models.Model):
    STATUS_CHOICES = (
        ('pendente', 'Pendente'),
        ('aceito', 'Aceito'),
        ('expirado', 'Expirado'),
    )

    email = models.EmailField()
    projeto = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='invitations')
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    role = models.CharField(max_length=20, default='VIEWER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    expira_em = models.DateTimeField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.expira_em:
            self.expira_em = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        return self.status == 'pendente' and self.expira_em > timezone.now()

    class Meta:
        verbose_name = 'Convite'
        verbose_name_plural = 'Convites'
