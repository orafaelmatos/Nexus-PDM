from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Invitation

@shared_task
def send_invitation_email(invitation_id):
    try:
        invitation = Invitation.objects.get(id=invitation_id)
        subject = f"Convite para o projeto {invitation.projeto.nome}"
        message = f"Você foi convidado para participar do projeto {invitation.projeto.nome} como {invitation.role}.\n\nPara aceitar, use o token: {invitation.token}"
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [invitation.email],
            fail_silently=False,
        )
    except Invitation.DoesNotExist:
        pass
