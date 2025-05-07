import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'open-meteo',
  name: ROUTE_NAMES.APPS_OPEN_METEO,
  redirect: { name: ROUTE_NAMES.OPEN_METEO_CURRENT },
  component: () => import('@/app/views/applications/open-meteo/open-meteo.view.vue'),
  children: [
    {
      path: 'current',
      name: ROUTE_NAMES.OPEN_METEO_CURRENT,
      component: () => import('@/app/views/home/home.view.vue')
    },
    {
      path: 'hourly',
      name: ROUTE_NAMES.OPEN_METEO_HOURLY,
      component: () => import('@/app/views/home/home.view.vue')
    }
  ]
}

export { route }
