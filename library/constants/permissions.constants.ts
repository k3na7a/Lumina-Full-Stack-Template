export enum PermissionDomain {
  SYSTEM = 'SYSTEM',
  FRONT_END = 'FRONT_END',
  SELF_MANAGEMENT = 'SELF_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  PERMISSION_MANAGEMENT = 'PERMISSION_MANAGEMENT',
  GAME_MANAGEMENT = 'GAME_MANAGEMENT',
  PLATFORM_MANAGEMENT = 'PLATFORM_MANAGEMENT',
  AUDIT_MANAGEMENT = 'AUDIT_MANAGEMENT'
}

export const iPermissionDomain: {
  [v: string]: { name: string; key: PermissionDomain; description: string }
} = {
  [PermissionDomain.SYSTEM]: {
    name: 'System',
    key: PermissionDomain.SYSTEM,
    description: 'Core system-level permissions and operations reserved for internal or administrative use.'
  },
  [PermissionDomain.FRONT_END]: {
    name: 'Front-End Permissions',
    key: PermissionDomain.FRONT_END,
    description:
      'Permissions controlling access to the administrative user interface, including visibility of dashboards, menus, and front-end features.'
  },
  [PermissionDomain.SELF_MANAGEMENT]: {
    name: 'Self Management',
    key: PermissionDomain.SELF_MANAGEMENT,
    description: 'Permissions that allow users to manage their own account settings, profile, and credentials.'
  },
  [PermissionDomain.USER_MANAGEMENT]: {
    name: 'User Management',
    key: PermissionDomain.USER_MANAGEMENT,
    description: 'Permissions for creating, updating, disabling, and otherwise administering other user accounts.'
  },
  [PermissionDomain.ROLE_MANAGEMENT]: {
    name: 'Role Management',
    key: PermissionDomain.ROLE_MANAGEMENT,
    description: 'Permissions for defining, assigning, and modifying roles within the system.'
  },
  [PermissionDomain.PERMISSION_MANAGEMENT]: {
    name: 'Permission Management',
    key: PermissionDomain.PERMISSION_MANAGEMENT,
    description: 'Permissions to configure, grant, or revoke access rights across different domains.'
  },
  [PermissionDomain.GAME_MANAGEMENT]: {
    name: 'Game Management',
    key: PermissionDomain.GAME_MANAGEMENT,
    description: 'Permissions related to adding, editing, and maintaining game entries and metadata.'
  },
  [PermissionDomain.PLATFORM_MANAGEMENT]: {
    name: 'Platform Management',
    key: PermissionDomain.PLATFORM_MANAGEMENT,
    description: 'Permissions related to adding, editing, and maintaining software platform entries and metadata.'
  },
  [PermissionDomain.AUDIT_MANAGEMENT]: {
    name: 'Audit Management',
    key: PermissionDomain.AUDIT_MANAGEMENT,
    description: 'Permissions for accessing and managing audit logs and event records.'
  }
}

// SYSTEM
export enum SystemPermissions {
  HAS_ALL_PERMISSIONS = 'has_all_permissions'
}

// FRONT-END
export enum FrontEndPermissions {
  CAN_VIEW_ADMIN_DASHBOARD = 'view_admin_dashboard',
  MANAGE_PERMISSIONS = 'manage_permissions',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_USERS = 'manage_users',
  MANAGE_GAMES = 'manage_games',
  MANAGE_PLATFORMS = 'manage_platforms',
  VIEW_AUDIT = 'view_audit'
}

// MANAGE SELF
export enum SelfManagementPermissions {
  MANAGE_SELF = 'manage_self',
  UPDATE_SELF = 'update_self',
  DELETE_SELF = 'delete_self'
}

// USER + PERMISSIONS ADMINISTRATION
export enum UserManagementPermissions {
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user'
}

export enum RoleManagementPermissions {
  CREATE_ROLE = 'create_role',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role'
}

export enum PermissionManagementPermissions {
  CREATE_PERMISSION = 'create_permission',
  READ_PERMISSION = 'read_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission'
}

// GAMES & SOFTWARE ADMINISTRATION
export enum GameManagementPermissions {
  CREATE_GAME = 'create_game',
  READ_GAME = 'read_game',
  UPDATE_GAME = 'update_game',
  DELETE_GAME = 'delete_game'
}

export enum PlatformManagementPermissions {
  CREATE_PLATFORM = 'create_platform',
  READ_PLATFORM = 'read_platform',
  UPDATE_PLATFORM = 'update_platform',
  DELETE_PLATFORM = 'delete_platform'
}

export enum AuditEventPermissions {
  READ_AUDIT = 'read_audit'
}

export type PermissionsKey =
  | SystemPermissions
  | SelfManagementPermissions
  | UserManagementPermissions
  | RoleManagementPermissions
  | PermissionManagementPermissions
  | GameManagementPermissions
  | PlatformManagementPermissions
  | AuditEventPermissions

export const PERMISSION_MATRIX = {
  [PermissionDomain.SYSTEM]: SystemPermissions,
  [PermissionDomain.FRONT_END]: FrontEndPermissions,
  [PermissionDomain.SELF_MANAGEMENT]: SelfManagementPermissions,
  [PermissionDomain.USER_MANAGEMENT]: UserManagementPermissions,
  [PermissionDomain.ROLE_MANAGEMENT]: RoleManagementPermissions,
  [PermissionDomain.PERMISSION_MANAGEMENT]: PermissionManagementPermissions,
  [PermissionDomain.GAME_MANAGEMENT]: GameManagementPermissions,
  [PermissionDomain.PLATFORM_MANAGEMENT]: PlatformManagementPermissions,
  [PermissionDomain.AUDIT_MANAGEMENT]: AuditEventPermissions
}
