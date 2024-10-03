import { sub_navigation } from '@/library/data/types/sub-navigation.type'
import { ROUTE_NAMES } from '@/app/router/routes'

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

const games_library_navigation: sub_navigation = [
  { label: 'Games', name: ROUTE_NAMES.ADMIN_GAMES_LIST },
  { label: 'Platforms', name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST }
]

export { administration_navigation, games_library_navigation }
