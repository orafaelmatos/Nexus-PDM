from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateSerializer
from .services import ProjectService
from .permissions import IsProjectOwner, IsMember
import os

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.filter(status='ativo')
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['destroy']:
            return [permissions.IsAuthenticated(), IsProjectOwner()]
        if self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsProjectOwner()]
        if self.action in ['tree']:
            return [permissions.IsAuthenticated(), IsMember()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Users can only see projects they are members of
        return Project.objects.filter(
            memberships__user=self.request.user,
            status='ativo'
        )

    def create(self, request, *args, **kwargs):
        serializer = ProjectCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = ProjectService.create_project(
            user=request.user,
            nome=serializer.validated_data['nome'],
            descricao=serializer.validated_data.get('descricao', '')
        )
        return Response(ProjectSerializer(project).data, status=status.HTTP_201_CREATED)

    def perform_destroy(self, instance):
        ProjectService.archive_project(self.request.user, instance)

    @decorators.action(detail=True, methods=['get'])
    def tree(self, request, pk=None):
        project = self.get_object()
        root_path = project.pasta_raiz
        
        if not os.path.exists(root_path):
            return Response({"tree": []})

        def get_tree(path):
            items = []
            try:
                for entry in os.scandir(path):
                    if entry.is_dir():
                        items.append({
                            "name": entry.name,
                            "type": "folder",
                            "children": get_tree(entry.path)
                        })
                    else:
                        items.append({
                            "name": entry.name,
                            "type": "file",
                            "size": entry.stat().st_size
                        })
            except PermissionError:
                pass
            return items

        return Response({"tree": get_tree(root_path)})
