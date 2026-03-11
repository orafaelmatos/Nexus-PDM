from django.db import transaction
from django.utils import timezone
from .models import Invitation
from apps.projects.models import ProjectMembership
from apps.audit.services import AuditService
from .tasks import send_invitation_email

class InvitationService:
    @staticmethod
    def create_invitation(user, project, email, role):
        # Prevent double invitation for same project/email if still pending
        if Invitation.objects.filter(projeto=project, email=email, status='pendente', expira_em__gt=timezone.now()).exists():
            raise ValueError("Já existe um convite pendente para este email neste projeto.")

        with transaction.atomic():
            invitation = Invitation.objects.create(
                projeto=project,
                email=email,
                role=role
            )
            
            AuditService.log_action(
                user=user,
                action='convite_enviado',
                entity_type='Invitation',
                entity_id=invitation.id,
                metadata={'email': email, 'projeto_id': project.id}
            )

            # Async task
            send_invitation_email.delay(invitation.id)
            
            return invitation

    @staticmethod
    def accept_invitation(user, token):
        try:
            invitation = Invitation.objects.get(token=token)
        except Invitation.DoesNotExist:
            raise ValueError("Convite inválido.")

        if not invitation.is_valid:
            invitation.status = 'expirado'
            invitation.save()
            raise ValueError("Este convite expirou ou já foi utilizado.")

        if invitation.email != user.email:
            raise ValueError("Este convite foi enviado para outro endereço de email.")

        with transaction.atomic():
            # Create membership
            ProjectMembership.objects.get_or_create(
                project=invitation.projeto,
                user=user,
                defaults={'role': invitation.role}
            )
            
            invitation.status = 'aceito'
            invitation.save()

            AuditService.log_action(
                user=user,
                action='convite_aceito',
                entity_type='Invitation',
                entity_id=invitation.id
            )
            
            return invitation
