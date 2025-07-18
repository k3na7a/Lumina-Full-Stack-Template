import { PermissionsKey, SelfManagementPermissions, SystemPermissions } from '../constants/permissions.constants'

enum Roles {
  PLATFORM_USER = 'USER',
  SYSTEM_ADMINISTRATOR = 'SYSTEM_ADMINISTRATOR'
}

interface RoleSeed {
  name: Roles
  label: string
  description?: string
  permissions: PermissionsKey[]
}

export const roles: RoleSeed[] = [
  {
    name: Roles.PLATFORM_USER,
    label: 'Platform User',
    description: 'Basic self-management permissions. Every user must have this role.',
    permissions: [SelfManagementPermissions.UPDATE_SELF, SelfManagementPermissions.DELETE_SELF]
  },
  {
    name: Roles.SYSTEM_ADMINISTRATOR,
    label: 'System Administrator',
    description: 'Has full access to all resources.',
    permissions: [SystemPermissions.HAS_ALL_PERMISSIONS]
  }
]
