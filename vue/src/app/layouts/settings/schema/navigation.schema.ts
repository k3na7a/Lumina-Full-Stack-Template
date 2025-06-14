import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const options: sub_navigation = [
  {
    name: ROUTE_NAMES.PROFILE,
    label: 'settings.profile.label'
  },
  {
    name: ROUTE_NAMES.SECURITY,
    label: 'settings.security-privacy.label'
  }
]

export { options }
