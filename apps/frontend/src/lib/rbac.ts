import { Role } from '@/types';

export type Permission =
  | 'VIEW_ALL_LEADS'
  | 'VIEW_OWN_LEADS'
  | 'CREATE_LEAD'
  | 'EDIT_ANY_LEAD'
  | 'EDIT_OWN_LEAD'
  | 'DELETE_LEAD'
  | 'UPDATE_LEAD_STATUS_ANY'
  | 'UPDATE_LEAD_STATUS_OWN'
  | 'ADD_NOTES_ANY'
  | 'ADD_NOTES_OWN'
  | 'UPLOAD_FILES_ANY'
  | 'UPLOAD_FILES_OWN'
  | 'VIEW_DASHBOARD_ALL'
  | 'VIEW_DASHBOARD_OWN'
  | 'VIEW_USERS_LIST'
  | 'CREATE_USERS'
  | 'DELETE_USERS'
  | 'VIEW_KANBAN_ALL'
  | 'VIEW_KANBAN_OWN';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'VIEW_ALL_LEADS',
    'CREATE_LEAD',
    'EDIT_ANY_LEAD',
    'DELETE_LEAD',
    'UPDATE_LEAD_STATUS_ANY',
    'ADD_NOTES_ANY',
    'UPLOAD_FILES_ANY',
    'VIEW_DASHBOARD_ALL',
    'VIEW_USERS_LIST',
    'CREATE_USERS',
    'DELETE_USERS',
    'VIEW_KANBAN_ALL',
  ],
  SALES_MANAGER: [
    'VIEW_ALL_LEADS',
    'CREATE_LEAD',
    'EDIT_ANY_LEAD',
    'UPDATE_LEAD_STATUS_ANY',
    'ADD_NOTES_ANY',
    'UPLOAD_FILES_ANY',
    'VIEW_DASHBOARD_ALL',
    'VIEW_USERS_LIST',
    'VIEW_KANBAN_ALL',
  ],
  SALES_REP: [
    'VIEW_OWN_LEADS',
    'CREATE_LEAD',
    'EDIT_OWN_LEAD',
    'UPDATE_LEAD_STATUS_OWN',
    'ADD_NOTES_OWN',
    'UPLOAD_FILES_OWN',
    'VIEW_DASHBOARD_OWN',
    'VIEW_KANBAN_OWN',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// Helper functions for common checks
export function canViewAllLeads(role: Role): boolean {
  return hasPermission(role, 'VIEW_ALL_LEADS');
}

export function canCreateLead(role: Role): boolean {
  return hasPermission(role, 'CREATE_LEAD');
}

export function canEditLead(role: Role, isOwner: boolean): boolean {
  if (isOwner && hasPermission(role, 'EDIT_OWN_LEAD')) return true;
  return hasPermission(role, 'EDIT_ANY_LEAD');
}

export function canDeleteLead(role: Role): boolean {
  return hasPermission(role, 'DELETE_LEAD');
}

export function canUpdateLeadStatus(role: Role, isOwner: boolean): boolean {
  if (isOwner && hasPermission(role, 'UPDATE_LEAD_STATUS_OWN')) return true;
  return hasPermission(role, 'UPDATE_LEAD_STATUS_ANY');
}

export function canAddNotes(role: Role, isOwnLead: boolean): boolean {
  if (isOwnLead && hasPermission(role, 'ADD_NOTES_OWN')) return true;
  return hasPermission(role, 'ADD_NOTES_ANY');
}

export function canUploadFiles(role: Role, isOwnLead: boolean): boolean {
  if (isOwnLead && hasPermission(role, 'UPLOAD_FILES_OWN')) return true;
  return hasPermission(role, 'UPLOAD_FILES_ANY');
}

export function canViewUsersList(role: Role): boolean {
  return hasPermission(role, 'VIEW_USERS_LIST');
}

export function canCreateUsers(role: Role): boolean {
  return hasPermission(role, 'CREATE_USERS');
}

export function canDeleteUsers(role: Role): boolean {
  return hasPermission(role, 'DELETE_USERS');
}
