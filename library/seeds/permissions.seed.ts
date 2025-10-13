import {
  PermissionDomain,
  PermissionsKey,
  SystemPermissions,
  FrontEndPermissions,
  SelfManagementPermissions,
  UserManagementPermissions,
  RoleManagementPermissions,
  PermissionManagementPermissions,
  GameManagementPermissions,
  PlatformManagementPermissions,
  AuditEventPermissions,
} from "../constants/permissions.constants";

export type PermissionSeed = {
  key: PermissionsKey | FrontEndPermissions;
  label: string;
  description: string;
  domain: PermissionDomain;
};

export const PERMISSIONS_SEED: PermissionSeed[] = [
  // SYSTEM
  {
    key: SystemPermissions.HAS_ALL_PERMISSIONS,
    label: "Has All Permissions",
    description:
      "Grants unrestricted access to all actions across the system, bypassing normal checks.",
    domain: PermissionDomain.SYSTEM,
  },

  // FRONTEND
  {
    key: FrontEndPermissions.CAN_VIEW_ADMIN_DASHBOARD,
    label: "View Admin Dashboard",
    description:
      "Allows the user to access the admin panel and view its main dashboard.",
    domain: PermissionDomain.FRONT_END,
  },

  // SELF MANAGEMENT
  {
    key: SelfManagementPermissions.UPDATE_SELF,
    label: "Update Self",
    description:
      "Allows the user to update their own profile and account details.",
    domain: PermissionDomain.SELF_MANAGEMENT,
  },
  {
    key: SelfManagementPermissions.DELETE_SELF,
    label: "Delete Self",
    description: "Allows the user to delete or deactivate their own account.",
    domain: PermissionDomain.SELF_MANAGEMENT,
  },

  // USER MANAGEMENT
  {
    key: UserManagementPermissions.CREATE_USER,
    label: "Create User",
    description: "Allows the creation of new user accounts.",
    domain: PermissionDomain.USER_MANAGEMENT,
  },
  {
    key: UserManagementPermissions.READ_USER,
    label: "Read User",
    description: "Allows viewing of user details and lists.",
    domain: PermissionDomain.USER_MANAGEMENT,
  },
  {
    key: UserManagementPermissions.UPDATE_USER,
    label: "Update User",
    description: "Allows editing user information and attributes.",
    domain: PermissionDomain.USER_MANAGEMENT,
  },
  {
    key: UserManagementPermissions.DELETE_USER,
    label: "Delete User",
    description: "Allows removal or deactivation of user accounts.",
    domain: PermissionDomain.USER_MANAGEMENT,
  },

  // ROLE MANAGEMENT
  {
    key: RoleManagementPermissions.CREATE_ROLE,
    label: "Create Role",
    description: "Allows creation of new roles for access control.",
    domain: PermissionDomain.ROLE_MANAGEMENT,
  },
  {
    key: RoleManagementPermissions.READ_ROLE,
    label: "Read Role",
    description: "Allows viewing of role details and assignments.",
    domain: PermissionDomain.ROLE_MANAGEMENT,
  },
  {
    key: RoleManagementPermissions.UPDATE_ROLE,
    label: "Update Role",
    description: "Allows modification of existing roles.",
    domain: PermissionDomain.ROLE_MANAGEMENT,
  },
  {
    key: RoleManagementPermissions.DELETE_ROLE,
    label: "Delete Role",
    description: "Allows removal of roles from the system.",
    domain: PermissionDomain.ROLE_MANAGEMENT,
  },

  // PERMISSION MANAGEMENT
  {
    key: PermissionManagementPermissions.CREATE_PERMISSION,
    label: "Create Permission",
    description: "Allows creation of new system permissions.",
    domain: PermissionDomain.PERMISSION_MANAGEMENT,
  },
  {
    key: PermissionManagementPermissions.READ_PERMISSION,
    label: "Read Permission",
    description: "Allows viewing the list of permissions.",
    domain: PermissionDomain.PERMISSION_MANAGEMENT,
  },
  {
    key: PermissionManagementPermissions.UPDATE_PERMISSION,
    label: "Update Permission",
    description: "Allows updating existing permissions.",
    domain: PermissionDomain.PERMISSION_MANAGEMENT,
  },
  {
    key: PermissionManagementPermissions.DELETE_PERMISSION,
    label: "Delete Permission",
    description: "Allows removal of permissions.",
    domain: PermissionDomain.PERMISSION_MANAGEMENT,
  },

  // GAME MANAGEMENT
  {
    key: GameManagementPermissions.CREATE_GAME,
    label: "Create Game",
    description: "Allows creation of new game entries.",
    domain: PermissionDomain.GAME_MANAGEMENT,
  },
  {
    key: GameManagementPermissions.READ_GAME,
    label: "Read Game",
    description: "Allows viewing of game information.",
    domain: PermissionDomain.GAME_MANAGEMENT,
  },
  {
    key: GameManagementPermissions.UPDATE_GAME,
    label: "Update Game",
    description: "Allows updating details of existing games.",
    domain: PermissionDomain.GAME_MANAGEMENT,
  },
  {
    key: GameManagementPermissions.DELETE_GAME,
    label: "Delete Game",
    description: "Allows removal of games from the system.",
    domain: PermissionDomain.GAME_MANAGEMENT,
  },

  // PLATFORM MANAGEMENT
  {
    key: PlatformManagementPermissions.CREATE_PLATFORM,
    label: "Create Platform",
    description: "Allows creation of new software platform entries.",
    domain: PermissionDomain.PLATFORM_MANAGEMENT,
  },
  {
    key: PlatformManagementPermissions.READ_PLATFORM,
    label: "Read Platform",
    description: "Allows viewing of platform information.",
    domain: PermissionDomain.PLATFORM_MANAGEMENT,
  },
  {
    key: PlatformManagementPermissions.UPDATE_PLATFORM,
    label: "Update Platform",
    description: "Allows updating existing platform entries.",
    domain: PermissionDomain.PLATFORM_MANAGEMENT,
  },
  {
    key: PlatformManagementPermissions.DELETE_PLATFORM,
    label: "Delete Platform",
    description: "Allows removal of platform entries from the system.",
    domain: PermissionDomain.PLATFORM_MANAGEMENT,
  },

  // AUDIT MANAGEMENT
  {
    key: AuditEventPermissions.READ_AUDIT,
    label: "Read Audit Logs",
    description: "Allows viewing of system audit events and records.",
    domain: PermissionDomain.AUDIT_MANAGEMENT,
  },
];
