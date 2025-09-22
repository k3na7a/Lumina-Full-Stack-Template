import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import { sub_navigation } from '@/shared/components/navigation/types/sub-navigation.type'

const options: sub_navigation = [
  { label: 'administration.activity-logs.all-activities.label', name: ROUTE_NAMES.ADMIN_ACTIVITY_LOGS_ALL },
  { label: 'administration.user-management.header', name: ROUTE_NAMES.ADMIN_ACTIVITY_LOGS_USERS },
  { label: 'administration.games-and-software.header', name: ROUTE_NAMES.ADMIN_ACTIVITY_LOGS_GAMES }
]

export { options }
