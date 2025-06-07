import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

import { route as UserRoutes } from './users.routes'
import { route as GamesRoutes } from './games.routes'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.ADMINISTRATION },
  component: () => import('@/app/router/guards/is-administrator.guard.vue'),
  children: [
    {
      path: '/administration',
      name: ROUTE_NAMES.ADMINISTRATION,
      redirect: { name: ROUTE_NAMES.ADMIN_USERS },
      meta: { pageTitle: 'Administration' },
      component: () => import('@/app/layouts/admin/administration.layout.vue'),
      children: [UserRoutes, GamesRoutes]
    }
  ]
}

export default route
