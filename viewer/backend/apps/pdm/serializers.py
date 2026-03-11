from rest_framework import serializers
from .models import Document, DocumentVersion
from apps.accounts.serializers import UserSerializer

class DocumentVersionSerializer(serializers.ModelSerializer):
    criado_por = UserSerializer(read_only=True)
    class Meta:
        model = DocumentVersion
        fields = ('id', 'numero_versao', 'arquivo', 'criado_em', 'criado_por', 'checksum_hash', 'tamanho_bytes', 'comentario')

class DocumentSerializer(serializers.ModelSerializer):
    latest_version = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ('id', 'projeto', 'nome', 'caminho_relativo', 'criado_por', 'criado_em', 'tipo', 'latest_version')
        read_only_fields = ('id', 'criado_em', 'criado_por')

    def get_latest_version(self, obj):
        version = obj.versions.order_by('-numero_versao').first()
        if version:
            return DocumentVersionSerializer(version).data
        return None

class DocumentCreateSerializer(serializers.Serializer):
    nome = serializers.CharField(max_length=255)
    caminho_relativo = serializers.CharField(max_length=500)
    arquivo = serializers.FileField()
    tipo = serializers.CharField(max_length=50)
    comentario = serializers.CharField(required=False, allow_blank=True)

class VersionUploadSerializer(serializers.Serializer):
    arquivo = serializers.FileField()
    comentario = serializers.CharField(required=False, allow_blank=True)
