from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Project(models.Model):
    STATUS_CHOICES = (
        ('ativo', 'Ativo'),
        ('arquivado', 'Arquivado'),
    )

    nome = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    descricao = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_projects')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    pasta_raiz = models.CharField(max_length=500)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ativo')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Projeto'
        verbose_name_plural = 'Projetos'
        ordering = ['-criado_em']

    def __str__(self):
        return self.nome

class ProjectMembership(models.Model):
    ROLE_CHOICES = (
        ('OWNER', 'Proprietário'),
        ('ENGINEER', 'Engenheiro'),
        ('VIEWER', 'Visualizador'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='project_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('project', 'user')
        verbose_name = 'Membro do Projeto'
        verbose_name_plural = 'Membros dos Projetos'
