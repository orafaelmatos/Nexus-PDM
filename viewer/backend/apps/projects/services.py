import os
import subprocess
from django.conf import settings
from .models import Project, ProjectMembership

class ProjectService:
    @staticmethod
    def create_project(user, nome, descricao=""):
        """
        Cria um projeto e inicializa o repositório git
        """
        from django.db import transaction
        from apps.audit.services import AuditService
        
        with transaction.atomic():
            project = Project.objects.create(
                nome=nome,
                descricao=descricao,
                owner=user
            )
            
            # Cria a associação de proprietário
            ProjectMembership.objects.create(
                project=project,
                user=user,
                role='OWNER'
            )

            # Create physical directory
            # Agora a estrutura é C:/pdm/projects/{slug}
            project_path = os.path.join(settings.MEDIA_ROOT, project.slug)
            os.makedirs(project_path, exist_ok=True)
            project.pasta_raiz = project_path
            
            # Initialize GIT repository for the project
            try:
                # Initialize repo
                subprocess.run(['git', 'init'], cwd=project_path, check=True, capture_output=True)
                
                # Create a basic .gitignore for CAD/SolidWorks
                gitignore_content = "*.tmp\n~$*\n*.bak\n"
                with open(os.path.join(project_path, '.gitignore'), 'w') as f:
                    f.write(gitignore_content)
                
                # Initial commit
                subprocess.run(['git', 'add', '.gitignore'], cwd=project_path, check=True)
                subprocess.run(['git', 'commit', '-m', 'Initial project repository setup'], cwd=project_path, check=True, env={
                    **os.environ,
                    'GIT_AUTHOR_NAME': user.get_full_name() or user.email,
                    'GIT_AUTHOR_EMAIL': user.email,
                    'GIT_COMMITTER_NAME': 'CloudPDM System',
                    'GIT_COMMITTER_EMAIL': 'system@cloudpdm.com'
                })
            except Exception as e:
                # Log error but don't fail project creation
                print(f"Erro ao inicializar Git no projeto {project.nome}: {str(e)}")

            project.save()

            # Log audit
            AuditService.log_action(
                user=user,
                action='projeto_criado',
                entity_type='Project',
                entity_id=project.id,
                metadata={'nome': project.nome}
            )

            return project
        
        # Atualiza o modelo com o caminho real
        project.pasta_raiz = project_path
        project.save()

        # Inicializa o GIT na pasta do projeto
        try:
            subprocess.run(['git', 'init'], cwd=project_path, check=True)
            # Cria um gitignore básico se não existir
            with open(os.path.join(project_path, '.gitignore'), 'w') as f:
                f.write('*.tmp\n~*\n')
            subprocess.run(['git', 'add', '.gitignore'], cwd=project_path, check=True)
            subprocess.run(['git', 'commit', '-m', 'Initial commit: Project structure created'], cwd=project_path, check=True)
        except Exception as e:
            print(f"Erro ao inicializar GIT: {e}")

        return project

    @staticmethod
    def get_user_projects(user):
        """
        Retorna todos os projetos onde o usuário é membro.
        """
        return Project.objects.filter(memberships__user=user)
