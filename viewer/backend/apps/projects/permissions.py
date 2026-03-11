from rest_framework import permissions

class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'project'):
            project = obj.project
        else:
            project = obj
        return project.memberships.filter(user=request.user, role='OWNER').exists()

class IsEngineerOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'project'):
            project = obj.project
        else:
            project = obj
        return project.memberships.filter(user=request.user, role__in=['OWNER', 'ENGINEER']).exists()

class IsMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'project'):
            project = obj.project
        else:
            project = obj
        return project.memberships.filter(user=request.user).exists()
