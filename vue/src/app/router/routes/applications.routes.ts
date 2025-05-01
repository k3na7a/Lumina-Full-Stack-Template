import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/applications',
  name: ROUTE_NAMES.APPLICATIONS,
  redirect: { name: ROUTE_NAMES.APPS_OPEN_METEO },
  meta: { pageTitle: 'Applications' },
  component: () => import('@/app/views/applications/applications.view.vue'),
  children: [
    {
      path: 'open-meteo',
      name: ROUTE_NAMES.APPS_OPEN_METEO,
      redirect: { name: ROUTE_NAMES.OPEN_METEO_CURRENT },
      component: () => import('@/app/views/applications/open-meteo/open-meteo.view.vue'),
      children: [
        {
          path: 'current',
          name: ROUTE_NAMES.OPEN_METEO_CURRENT,
          component: () => import('@/app/views/home/home.view.vue')
        }
      ]
    }
  ]
}

export default route
