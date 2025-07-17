import { PermissionDomain } from '../constants/permissions.constants'

export type PermissionSeed = {
  key: string
  label: string
  description: string
  domain: PermissionDomain
}

export const PERMISSIONS_SEED: PermissionSeed[] = [
  {
    key: 'has_all_permissions',
    label: 'Has All Permissions',
    description: 'Grants the user unrestricted access to all actions in the system.',
    domain: PermissionDomain.SYSTEM
  }
]
