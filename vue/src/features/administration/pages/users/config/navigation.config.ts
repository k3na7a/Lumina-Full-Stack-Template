import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import { sub_navigation } from '@/library/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.user-management.users.label', name: ROUTE_NAMES.ADMIN_USERS },
  { label: 'administration.user-management.roles.label', name: ROUTE_NAMES.ADMIN_USER_ROLES },
  { label: 'administration.user-management.permissions.label', name: ROUTE_NAMES.ADMIN_USER_PERMISSIONS }
]

export { options }
