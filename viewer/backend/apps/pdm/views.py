from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Document, DocumentVersion
from .serializers import (
    DocumentSerializer, DocumentCreateSerializer, 
    DocumentVersionSerializer, VersionUploadSerializer
)
from .services import PDMService
from apps.projects.models import Project
from apps.projects.permissions import IsMember, IsEngineerOrOwner

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'upload_version']:
            return [permissions.IsAuthenticated(), IsEngineerOrOwner()]
        return [permissions.IsAuthenticated(), IsMember()]

    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')
        if project_id:
            return Document.objects.filter(projeto_id=project_id)
        return Document.objects.filter(projeto__memberships__user=self.request.user)

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('projeto')
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Projeto não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions manually since it's a create action with a FK
        if not project.memberships.filter(user=request.user, role__in=['OWNER', 'ENGINEER']).exists():
            return Response({"error": "Permissão negada"}, status=status.HTTP_403_FORBIDDEN)

        serializer = DocumentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            documento, version = PDMService.create_document_with_version(
                user=request.user,
                projeto=project,
                nome=serializer.validated_data['nome'],
                caminho_relativo=serializer.validated_data['caminho_relativo'],
                arquivo=serializer.validated_data['arquivo'],
                tipo=serializer.validated_data['tipo'],
                comentario=serializer.validated_data.get('comentario', '')
            )
            return Response(DocumentSerializer(documento).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['post'], url_path='upload-version')
    def upload_version(self, request, pk=None):
        documento = self.get_object()
        serializer = VersionUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            version = PDMService.upload_new_version(
                user=request.user,
                documento=documento,
                arquivo=serializer.validated_data['arquivo'],
                comentario=serializer.validated_data.get('comentario', '')
            )
            return Response(DocumentVersionSerializer(version).data, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @decorators.action(detail=True, methods=['get'], url_path='versions')
    def versions(self, request, pk=None):
        documento = self.get_object()
        versions = documento.versions.all()
        serializer = DocumentVersionSerializer(versions, many=True)
        return Response(serializer.data)

    @decorators.action(detail=False, methods=['get'], url_path='project-files')
    def project_files(self, request):
        """Lista os arquivos reais da pasta do projeto"""
        project_id = request.query_params.get('project_id')
        if not project_id:
            return Response({"error": "project_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Projeto não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica permissão
        if not project.memberships.filter(user=request.user).exists():
            return Response({"error": "Permissão negada"}, status=status.HTTP_403_FORBIDDEN)
        
        files = PDMService.list_project_files(project)
        return Response(files)
