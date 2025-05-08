import { ROUTE_NAMES } from '@/app/router/routes'
import { side_navigation } from '@/library/data/types/sub-navigation.type'

const routes: side_navigation = [
  {
    name: ROUTE_NAMES.APPS_OPEN_METEO,
    label: 'Open-Meteo Forecast',
    icon: ['fas', 'cloud-showers-heavy']
  }
]

export { routes }
