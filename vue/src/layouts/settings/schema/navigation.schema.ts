import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { sub_navigation } from '@/shared/components/side-nav/types/sub-navigation.type'

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
