import { ROUTE_NAMES } from '@/app/router/routes'
import { side_navigation } from '@/library/data/types/sub-navigation.type'

const routes: side_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_USERS,
    label: 'administration.users.label',
    icon: ['fas', 'user']
  }
]

export { routes }
