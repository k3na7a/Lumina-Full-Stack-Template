export enum PermissionDomain {
  SYSTEM = 'SYSTEM',
  SELF_MANAGEMENT = 'SELF_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  PERMISSION_MANAGEMENT = 'PERMISSION_MANAGEMENT',
  GAME_MANAGEMENT = 'GAME_MANAGEMENT',
  PLATFORM_MANAGEMENT = 'PLATFORM_MANAGEMENT'
}

// SYSTEM
export enum SystemPermissions {
  HAS_ALL_PERMISSIONS = 'has_all_permissions',
  CAN_VIEW_ADMIN_DASHBOARD = 'view_admin_dashboard'
}

// MANAGE SELF
export enum SelfManagementPermissions {
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

export type PermissionsKey =
  | SystemPermissions
  | SelfManagementPermissions
  | UserManagementPermissions
  | RoleManagementPermissions
  | PermissionManagementPermissions
  | GameManagementPermissions
  | PlatformManagementPermissions

export const PERMISSION_MATRIX = {
  [PermissionDomain.SYSTEM]: SystemPermissions,
  [PermissionDomain.SELF_MANAGEMENT]: SelfManagementPermissions,
  [PermissionDomain.USER_MANAGEMENT]: UserManagementPermissions,
  [PermissionDomain.ROLE_MANAGEMENT]: RoleManagementPermissions,
  [PermissionDomain.PERMISSION_MANAGEMENT]: PermissionManagementPermissions,
  [PermissionDomain.GAME_MANAGEMENT]: GameManagementPermissions,
  [PermissionDomain.PLATFORM_MANAGEMENT]: PlatformManagementPermissions
}
