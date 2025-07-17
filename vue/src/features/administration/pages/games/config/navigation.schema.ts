import { ROUTE_NAMES } from '@/core/router/route-names.enum'
import { sub_navigation } from '@/shared/components/navigation/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.games-and-software.games.label', name: ROUTE_NAMES.ADMIN_GAMES },
  { label: 'administration.games-and-software.platforms.label', name: ROUTE_NAMES.ADMIN_PLATFORMS }
]

export { options }
