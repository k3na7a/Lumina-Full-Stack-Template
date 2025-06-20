import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

import { route as users } from '@/features/administration/users/routes/users.routes'
import { route as games } from '@/features/administration/games/routes/games.routes'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.ADMINISTRATION },
  component: () => import('@/core/router/guards/is-administrator.guard.vue'),
  children: [
    {
      path: '/administration',
      name: ROUTE_NAMES.ADMINISTRATION,
      redirect: { name: ROUTE_NAMES.ADMIN_USERS },
      meta: { pageTitle: 'Administration' },
      component: () => import('@/shared/layouts/admin/administration.layout.vue'),
      children: [users, games]
    }
  ]
}

export default route
