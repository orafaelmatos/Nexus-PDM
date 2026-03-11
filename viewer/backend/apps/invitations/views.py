from rest_framework import status, permissions, views
from rest_framework.response import Response
from .services import InvitationService
from apps.projects.models import Project

class InviteMemberView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Projeto não encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Only owners can invite
        if not project.memberships.filter(user=request.user, role='OWNER').exists():
            return Response({"error": "Apenas o proprietário pode convidar membros"}, status=status.HTTP_403_FORBIDDEN)

        email = request.data.get('email')
        role = request.data.get('role', 'VIEWER')
        
        if not email:
            return Response({"error": "Email é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            InvitationService.create_invitation(request.user, project, email, role)
            return Response({"message": "Convite enviado com sucesso"}, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AcceptInvitationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            InvitationService.accept_invitation(request.user, token)
            return Response({"message": "Convite aceito com sucesso"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
