import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

type nav = {
  label: string
  name: ROUTE_NAMES
  icon: [string, string]
  auth?: boolean
}

const MAIN_NAVIGATION: Array<nav> = [
  {
    label: 'navigation.home',
    name: ROUTE_NAMES.HOME,
    icon: ['fas', 'home']
  }
]

export { MAIN_NAVIGATION }
