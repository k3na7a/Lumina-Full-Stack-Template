import { ROUTE_NAMES } from '@/app/router/routes'

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
  },
  {
    label: 'navigation.library',
    name: ROUTE_NAMES.LIBRARY,
    icon: ['fas', 'gamepad']
  }
  // {
  //   label: 'navigation.applications',
  //   name: ROUTE_NAMES.APPLICATIONS,
  //   icon: ['fas', 'code-pull-request']
  // }
]

export { MAIN_NAVIGATION }
