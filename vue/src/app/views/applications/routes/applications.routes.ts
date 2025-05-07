import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

import { route as OpenMeteo } from '../open-meteo/routes/open-meteo.routes'

const route: RouteRecordRaw = {
  path: '/applications',
  name: ROUTE_NAMES.APPLICATIONS,
  redirect: { name: ROUTE_NAMES.APPS_OPEN_METEO },
  meta: { pageTitle: 'Applications' },
  component: () => import('@/app/views/applications/applications.view.vue'),
  children: [OpenMeteo]
}

export default route
