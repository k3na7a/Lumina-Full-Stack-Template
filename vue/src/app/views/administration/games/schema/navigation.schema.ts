import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'Games & Software', name: ROUTE_NAMES.ADMIN_GAMES },
  { label: 'Platforms', name: ROUTE_NAMES.ADMIN_USERS }
]

export { options }
