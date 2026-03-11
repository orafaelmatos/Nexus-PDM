from django.urls import path
from .views import InviteMemberView, AcceptInvitationView

urlpatterns = [
    path('projects/<int:project_id>/invite/', InviteMemberView.as_view(), name='invite-member'),
    path('accept/', AcceptInvitationView.as_view(), name='accept-invitation'),
]
