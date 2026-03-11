from .models import AuditLog
import json

class AuditService:
    @staticmethod
    def log_action(user, action, entity_type, entity_id, metadata=None):
        AuditLog.objects.create(
            user=user,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata_json=metadata or {}
        )
