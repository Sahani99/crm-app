import { useAuthStore } from '@/store/authStore';
import { Role } from '@/types';
import {
  hasPermission,
  hasPermissions,
  hasAnyPermission,
  canViewAllLeads,
  canCreateLead,
  canEditLead,
  canDeleteLead,
  canUpdateLeadStatus,
  canAddNotes,
  canUploadFiles,
  canViewUsersList,
  canCreateUsers,
  canDeleteUsers,
  Permission,
} from '@/lib/rbac';

export function usePermission() {
  const { user } = useAuthStore();

  const hasRole = (...roles: Role[]) => {
    if (!user) return false;
    return roles.includes(user.role as Role);
  };

  const isAdmin = hasRole('ADMIN');
  const isManager = hasRole('ADMIN', 'SALES_MANAGER');
  const isRep = hasRole('SALES_REP');

  if (!user) {
    return {
      hasRole,
      isAdmin: false,
      isManager: false,
      isRep: false,
      hasPermission: () => false,
      hasPermissions: () => false,
      hasAnyPermission: () => false,
      canViewAllLeads: () => false,
      canCreateLead: () => false,
      canEditLead: () => false,
      canDeleteLead: () => false,
      canUpdateLeadStatus: () => false,
      canAddNotes: () => false,
      canUploadFiles: () => false,
      canViewUsersList: () => false,
      canCreateUsers: () => false,
      canDeleteUsers: () => false,
      role: undefined,
    };
  }

  return {
    hasRole,
    isAdmin,
    isManager,
    isRep,
    hasPermission: (permission: Permission) => hasPermission(user.role, permission),
    hasPermissions: (permissions: Permission[]) => hasPermissions(user.role, permissions),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(user.role, permissions),
    canViewAllLeads: () => canViewAllLeads(user.role),
    canCreateLead: () => canCreateLead(user.role),
    canEditLead: (isOwner: boolean) => canEditLead(user.role, isOwner),
    canDeleteLead: () => canDeleteLead(user.role),
    canUpdateLeadStatus: (isOwner: boolean) => canUpdateLeadStatus(user.role, isOwner),
    canAddNotes: (isOwnLead: boolean) => canAddNotes(user.role, isOwnLead),
    canUploadFiles: (isOwnLead: boolean) => canUploadFiles(user.role, isOwnLead),
    canViewUsersList: () => canViewUsersList(user.role),
    canCreateUsers: () => canCreateUsers(user.role),
    canDeleteUsers: () => canDeleteUsers(user.role),
    role: user.role,
  };
}