import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import { side_navigation } from '@/shared/components/navigation/types/sub-navigation.type'

const routes: side_navigation = [
  {
    name: ROUTE_NAMES.ADMIN_DASHBOARD,
    label: 'administration.dashboard.label',
    icon: ['fas', 'gauge']
  },
  {
    name: ROUTE_NAMES.ADMIN_USER_MANAGEMENT,
    label: 'administration.user-management.header',
    icon: ['fas', 'user']
  },
  {
    name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
    label: 'administration.games-and-software.header',
    icon: ['fas', 'gamepad']
  },
  {
    name: ROUTE_NAMES.ADMIN_ACTIVITY_LOGS,
    label: 'administration.activity-logs.label',
    icon: ['fas', 'timeline']
  }
]

const footer = [
  {
    action: () => {},
    label: 'actions.send-feedback',
    icon: ['fas', 'message']
  }
]

export { routes, footer }
