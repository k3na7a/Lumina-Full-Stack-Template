import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
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

export { route }
