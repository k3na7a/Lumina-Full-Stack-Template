import { ROUTE_NAMES } from '@/core/router/route-names.enum'
import { nav } from '../types/navigation.type'

const MAIN_NAVIGATION: Array<nav> = [
  {
    label: 'navigation.home',
    name: ROUTE_NAMES.HOME,
    icon: ['fas', 'home']
  }
]

export { MAIN_NAVIGATION }
