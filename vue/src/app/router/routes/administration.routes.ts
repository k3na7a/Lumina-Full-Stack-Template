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
          name: ROUTE_NAMES.ADMIN_USERS,
          redirect: { name: ROUTE_NAMES.ADMIN_USER_LIST },
          component: () => import('@/app/views/administration/pages/users.view.vue'),
          children: [
            {
              path: 'users',
              name: ROUTE_NAMES.ADMIN_USER_LIST,
              component: () => import('@/app/views/administration/components/users-table.component.vue')
            }
          ]
        }
      ]
    }
  ]
}

export default route
