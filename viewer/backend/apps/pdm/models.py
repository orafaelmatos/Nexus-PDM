from django.db import models
from django.conf import settings
from apps.projects.models import Project

class Document(models.Model):
    projeto = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    nome = models.CharField(max_length=255)
    caminho_relativo = models.CharField(max_length=500) # e.g., 'parts/engine.step'
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    tipo = models.CharField(max_length=50) # CAD, PDF, etc

    class Meta:
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
        unique_together = ('projeto', 'caminho_relativo')

    def __str__(self):
        return self.nome

def document_version_path(instance, filename):
    # /data/pdm_projects/{slug}/documents/{doc_id}/v{n}/file.ext
    project_slug = instance.documento.projeto.slug
    doc_id = instance.documento.id
    version_num = instance.numero_versao
    return f'pdm_projects/{project_slug}/documents/{doc_id}/v{version_num}/{filename}'

class DocumentVersion(models.Model):
    documento = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    numero_versao = models.PositiveIntegerField()
    arquivo = models.FileField(upload_to=document_version_path)
    criado_em = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    checksum_hash = models.CharField(max_length=64)
    tamanho_bytes = models.BigIntegerField()
    comentario = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Versão do Documento'
        verbose_name_plural = 'Versões dos Documentos'
        unique_together = ('documento', 'numero_versao')
        ordering = ['-numero_versao']

    def __str__(self):
        return f"{self.documento.nome} v{self.numero_versao}"
