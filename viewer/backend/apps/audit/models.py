from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50) # e.g., 'Project', 'Document'
    entity_id = models.IntegerField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata_json = models.JSONField(default=dict)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Log de Auditoria'
        verbose_name_plural = 'Logs de Auditoria'

    def __str__(self):
        return f"{self.user} - {self.action} - {self.timestamp}"
