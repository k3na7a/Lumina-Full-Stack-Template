import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { side_navigation } from '@/shared/components/side-nav/types/sub-navigation.type'

const routes: side_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_USERS,
    label: 'administration.users.label',
    icon: ['fas', 'user']
  },
  {
    name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
    label: 'administration.games-and-software.label',
    icon: ['fas', 'book']
  }
]

export { routes }
