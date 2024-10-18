import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const games_library_navigation: sub_navigation = [
  { label: 'Games', name: ROUTE_NAMES.ADMIN_GAMES_LIST },
  { label: 'Platforms', name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST },
  { label: 'Genres', name: ROUTE_NAMES.ADMIN_GAMES_GENRES_LIST }
]

export { games_library_navigation }
