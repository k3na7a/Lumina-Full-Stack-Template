import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/administration-routes',
  redirect: { name: ROUTE_NAMES.ADMINISTRATION },
  component: () => import('@/app/router/guards/administration.guard.vue'),
  children: [
    {
      path: '/administration',
      name: ROUTE_NAMES.ADMINISTRATION,
      redirect: { name: ROUTE_NAMES.ADMIN_USERS },
      meta: { pageTitle: 'Administration' },
      component: () => import('@/app/views/administration/administration.view.vue'),
      children: [
        {
          path: 'user-management',
          redirect: { name: ROUTE_NAMES.ADMIN_USERS },
          component: () => import('@/app/views/administration/users/users.view.vue'),
          children: [
            {
              path: 'users',
              name: ROUTE_NAMES.ADMIN_USERS,
              component: () => import('@/app/views/administration/users/pages/users-table.component.vue')
            }
          ]
        }
      ]
    }
  ]
}

export default route
