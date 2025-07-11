import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import { sub_navigation } from '@/library/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.users.label', name: ROUTE_NAMES.ADMIN_USERS },
  { label: 'Roles', name: ROUTE_NAMES.ADMIN_DASHBOARD },
  { label: 'Permissions', name: ROUTE_NAMES.ADMIN_DASHBOARD }
]

export { options }
