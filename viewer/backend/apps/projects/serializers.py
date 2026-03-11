from rest_framework import serializers
from .models import Project, ProjectMembership
from apps.accounts.serializers import UserSerializer

class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = ProjectMembership
        fields = ('id', 'user', 'role', 'criado_em')

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = ('id', 'nome', 'slug', 'descricao', 'owner', 'criado_em', 'atualizado_em', 'status')
        read_only_fields = ('id', 'slug', 'owner', 'criado_em', 'atualizado_em')

class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('nome', 'descricao')
