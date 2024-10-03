import { sub_navigation } from '@/library/data/types/sub-navigation.type'
import { ROUTE_NAMES } from '@/app/router/routes'

const settings_navigation: sub_navigation = [
  {
    name: ROUTE_NAMES.PROFILE,
    label: 'administration.settings.profile.label'
  },
  {
    name: ROUTE_NAMES.SECURITY,
    label: 'administration.settings.security-privacy.label'
  }
]

export { settings_navigation }
