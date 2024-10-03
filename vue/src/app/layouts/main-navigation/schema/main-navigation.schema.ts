import { ROUTE_NAMES } from '@/app/router/routes'

type nav = {
  label: string
  name: ROUTE_NAMES
  icon: [string, string]
  auth?: boolean
}

const MAIN_NAVIGATION: Array<nav> = [
  {
    label: 'navigation.games',
    name: ROUTE_NAMES.GAMES,
    icon: ['fas', 'gamepad']
  },
  {
    label: 'navigation.applications',
    name: ROUTE_NAMES.APPLICATIONS,
    icon: ['fas', 'code-pull-request']
  }
]

export { MAIN_NAVIGATION }
export type { nav }
