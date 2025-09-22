import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import { more_navigation } from '../../../components/dropdown/types/more-navigation.type'

const MORE_NAVIGATION: more_navigation = [
  {
    title: 'navigation.general',
    children: [
      { title: 'navigation.subnavigation.about', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.blog', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.developers', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.jobs', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.partners', redirect: ROUTE_NAMES.HOME }
    ]
  },
  {
    title: 'navigation.help&legal',
    children: [
      { title: 'navigation.subnavigation.community', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.cookies', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.help', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.privacy', redirect: ROUTE_NAMES.HOME },
      { title: 'navigation.subnavigation.terms', redirect: ROUTE_NAMES.HOME }
    ]
  }
]

export { MORE_NAVIGATION }
