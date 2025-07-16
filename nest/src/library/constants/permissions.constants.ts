export enum PermissionDomain {
  SYSTEM = 'SYSTEM',
  SELF_MANAGEMENT = 'SELF_MANAGEMENT',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  ROLE_MANAGEMENT = 'ROLE_MANAGEMENT',
  PERMISSION_MANAGEMENT = 'PERMISSION_MANAGEMENT',
  GAME_MANAGEMENT = 'GAME_MANAGEMENT',
  PLATFORM_MANAGEMENT = 'PLATFORM_MANAGEMENT',
}

// APP LEVEL PERMISSIONS

export enum ApplicationPermissions {
  HAS_ALL = 'has_all',
  IS_ADMINISTRATOR = 'is_administrator',
}

// AUTH + SETTINGS PERMISSIONS

export enum SelfManagementPermissions {
  READ_SELF = 'read_self',
  UPDATE_SELF = 'update_self',
  DELETE_SELF = 'delete_self',
}

// USER ADMINISTRATION PERMISSIONS

export enum UserManagementPermissions {
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
}

export enum RoleManagementPermissions {
  CREATE_ROLE = 'create_role',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
}

export enum PermissionManagementPermissions {
  CREATE_PERMISSION = 'create_permission',
  READ_PERMISSION = 'read_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',
}

// GAME ADMINISTRATION PERMISSIONS

export enum GameManagementPermissions {
  CREATE_GAME = 'create_game',
  READ_GAME = 'read_game',
  UPDATE_GAME = 'update_game',
  DELETE_GAME = 'delete_game',
}

export enum PlatformManagementPermissions {
  CREATE_PLATFORM = 'create_platform',
  READ_PLATFORM = 'read_platform',
  UPDATE_PLATFORM = 'update_platform',
  DELETE_PLATFORM = 'delete_platform',
}

export const PERMISSION_MATRIX = {
  // SYSTEM LEVEL PERMISSIONS
  [PermissionDomain.SYSTEM]: ApplicationPermissions,
  // DEFAULT USER LEVEL PERMISSIONS
  [PermissionDomain.SELF_MANAGEMENT]: SelfManagementPermissions,
  // MODULE ADMINISTRATION LEVEL PERMISSIONS
  [PermissionDomain.USER_MANAGEMENT]: UserManagementPermissions,
  [PermissionDomain.ROLE_MANAGEMENT]: RoleManagementPermissions,
  [PermissionDomain.PERMISSION_MANAGEMENT]: PermissionManagementPermissions,
  [PermissionDomain.GAME_MANAGEMENT]: GameManagementPermissions,
  [PermissionDomain.PLATFORM_MANAGEMENT]: PlatformManagementPermissions,
};

export const DEFAULT_ROLE_PERMISSIONS = [
  SelfManagementPermissions.READ_SELF,
  SelfManagementPermissions.UPDATE_SELF,
  SelfManagementPermissions.DELETE_SELF,
];
