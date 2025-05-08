import { ROUTE_NAMES } from '@/app/router/routes'
import { sub_navigation } from '@/library/data/types/sub-navigation.type'

const routes: sub_navigation = [
  {
    name: ROUTE_NAMES.OPEN_METEO_CURRENT,
    label: 'Current'
  },
  {
    name: ROUTE_NAMES.OPEN_METEO_HOURLY,
    label: 'Hourly'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: '7 Days'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: '14 Days'
  },
  {
    name: ROUTE_NAMES.PROFILE,
    label: 'Historical'
  }
]

export { routes }
