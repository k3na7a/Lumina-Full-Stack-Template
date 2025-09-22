import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import { sub_navigation } from '@/shared/components/navigation/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.games-and-software.games.label', name: ROUTE_NAMES.ADMIN_GAMES },
  { label: 'administration.games-and-software.platforms.label', name: ROUTE_NAMES.ADMIN_PLATFORMS },
  { label: 'navigation.history', name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE_HISTORY }
]

export { options }
