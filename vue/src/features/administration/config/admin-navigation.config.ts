import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import { side_navigation } from '@/library/types/sub-navigation.type'

const routes: side_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_DASHBOARD,
    label: 'administration.dashboard.label',
    icon: ['fas', 'gauge']
  },
  {
    name: ROUTE_NAMES.ADMIN_USERS,
    label: 'administration.user-management.header',
    icon: ['fas', 'user']
  },
  {
    name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
    label: 'administration.games-and-software.header',
    icon: ['fas', 'book']
  }
]

export { routes }
