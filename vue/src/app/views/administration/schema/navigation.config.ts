import { sub_navigation } from '@/library/types/sub-navigation.type'
import { ROUTE_NAMES } from '@/app/router/routes.enum'

const administration_navigation: sub_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_USERS,
    label: 'administration.users.label'
  },
  {
    name: ROUTE_NAMES.ADMIN_GAMES_LIST,
    label: 'administration.games.label'
  }
]

export { administration_navigation }
