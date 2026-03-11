import hashlib
import os
import shutil
import subprocess
from datetime import datetime
from django.db import transaction
from django.conf import settings
from .models import Document, DocumentVersion
from apps.audit.services import AuditService

ALLOWED_CAD_EXTENSIONS = {'.step', '.stp', '.iges', '.igs', '.stl', '.obj', '.dwg', '.dxf', '.sldprt', '.slddrw', '.sldasm', '.pdf'}

class PDMService:
    @staticmethod
    def calculate_checksum(file):
        sha256_hash = hashlib.sha256()
        for byte_block in file.chunks():
            sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    @staticmethod
    def upload_new_version(user, documento, arquivo, comentario=""):
        # Validate extension
        ext = os.path.splitext(arquivo.name)[1].lower()
        
        checksum = PDMService.calculate_checksum(arquivo)
        
        # Prevent duplicate upload via checksum in same document
        if DocumentVersion.objects.filter(documento=documento, checksum_hash=checksum).exists():
            raise ValueError("Esta versão do arquivo já foi enviada anteriormente.")

        with transaction.atomic():
            # Get latest version number
            last_version = documento.versions.order_by('-numero_versao').first()
            next_version_num = (last_version.numero_versao + 1) if last_version else 1

            # --- Gerenciamento Físico de Pastas Customizada ---
            # Estrutura: {projeto_root}/{nome_peca}/v{n}/{arquivo}
            projeto_path = documento.projeto.pasta_raiz
            # Usar o nome do documento (sem extensão ou com) para a pasta da Peça
            peca_folder_name = os.path.splitext(documento.nome)[0]
            peca_path = os.path.join(projeto_path, peca_folder_name)
            
            # Criar pasta da peça se não existir
            os.makedirs(peca_path, exist_ok=True)
            
            # Pasta da nova versão
            version_folder_name = f"v{next_version_num}"
            version_path = os.path.join(peca_path, version_folder_name)
            os.makedirs(version_path, exist_ok=True)

            # Salvar arquivo fisicamente na pasta vN
            file_dest = os.path.join(version_path, arquivo.name)
            with open(file_dest, 'wb+') as destination:
                for chunk in arquivo.chunks():
                    destination.write(chunk)

            # --- Commit no Git ---
            try:
                subprocess.run(['git', 'add', '.'], cwd=projeto_path, check=True)
                subprocess.run(['git', 'commit', '-m', f"Upload {documento.nome} v{next_version_num}: {comentario}"], 
                               cwd=projeto_path, check=True, env={**os.environ, 'GIT_AUTHOR_NAME': user.email, 'GIT_COMMITTER_NAME': 'PDM System'})
            except:
                pass

            # --- Gerenciamento de Espaço (Manter apenas 2 versões) ---
            # Se a versão atual é > 2, deletar v(N-2)
            if next_version_num > 2:
                old_version_to_delete = next_version_num - 2
                old_version_path = os.path.join(peca_path, f"v{old_version_to_delete}")
                if os.path.exists(old_version_path):
                    shutil.rmtree(old_version_path)
                
                # Opcional: Remover do banco também ou manter registro mas sem arquivo
                # Aqui removemos apenas a pasta física para economizar espaço como pedido.

            # Registrar no banco
            version = DocumentVersion.objects.create(
                documento=documento,
                numero_versao=next_version_num,
                arquivo=f"{peca_folder_name}/{version_folder_name}/{arquivo.name}", # Caminho relativo para o FileField
                criado_por=user,
                checksum_hash=checksum,
                tamanho_bytes=arquivo.size,
                comentario=comentario
            )

            AuditService.log_action(
                user=user,
                action='versao_enviada',
                entity_type='DocumentVersion',
                entity_id=version.id,
                metadata={'document_id': documento.id, 'version_num': next_version_num}
            )

            return version

    @staticmethod
    def create_document_with_version(user, projeto, nome, caminho_relativo, arquivo, tipo, comentario=""):
        with transaction.atomic():
            documento = Document.objects.create(
                projeto=projeto,
                nome=nome,
                caminho_relativo=caminho_relativo,
                criado_por=user,
                tipo=tipo
            )
            version = PDMService.upload_new_version(user, documento, arquivo, comentario)
            return documento, version

    @staticmethod
    def list_project_files(projeto):
        """
        Lista todos os arquivos da pasta do projeto.
        Retorna uma lista com informações dos arquivos encontrados.
        """
        files = []
        pasta_raiz = projeto.pasta_raiz
        
        if not os.path.exists(pasta_raiz):
            return files
        
        # Percorre recursivamente a pasta do projeto
        for root, dirs, filenames in os.walk(pasta_raiz):
            # Ignorar pastas .git
            if '.git' in dirs:
                dirs.remove('.git')
                
            for filename in filenames:
                # Ignorar arquivos .git ou que começam com .git
                if filename.startswith('.git'):
                    continue
                    
                filepath = os.path.join(root, filename)
                
                # Calcula o caminho relativo
                caminho_relativo = os.path.relpath(filepath, pasta_raiz)
                
                # Pega informações do arquivo
                try:
                    stat_info = os.stat(filepath)
                    tamanho = stat_info.st_size
                    modified_time = datetime.fromtimestamp(stat_info.st_mtime)
                    
                    files.append({
                        'nome': filename,
                        'caminho_relativo': caminho_relativo,
                        'tamanho': tamanho,
                        'modificado': modified_time.isoformat(),
                        'extensao': os.path.splitext(filename)[1].lower(),
                        'caminho_completo': filepath
                    })
                except OSError:
                    # Ignora arquivos que não podem ser acessados
                    continue
        
        return sorted(files, key=lambda x: x['nome'])
