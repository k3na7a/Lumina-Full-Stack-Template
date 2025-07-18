import { PermissionDomain, PermissionsKey, SystemPermissions } from '../constants/permissions.constants'

export type PermissionSeed = {
  key: PermissionsKey
  label: string
  description: string
  domain: PermissionDomain
}

export const PERMISSIONS_SEED: PermissionSeed[] = [
  {
    key: SystemPermissions.HAS_ALL_PERMISSIONS,
    label: 'Has All Permissions',
    description: 'Grants the user unrestricted access to all actions in the system.',
    domain: PermissionDomain.SYSTEM
  }
]
