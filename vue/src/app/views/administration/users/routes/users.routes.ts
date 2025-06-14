import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'user-management',
  redirect: { name: ROUTE_NAMES.ADMIN_USERS },
  component: () => import('@/app/views/administration/users/users.view.vue'),
  children: [
    {
      path: 'users',
      redirect: { name: ROUTE_NAMES.ADMIN_USERS },
      children: [
        {
          path: '',
          name: ROUTE_NAMES.ADMIN_USERS,
          component: () => import('@/app/views/administration/users/pages/user-table.view.vue')
        },
        {
          path: ':id',
          name: ROUTE_NAMES.ADMIN_USERS_SINGLE,
          component: () => import('@/app/views/administration/users/pages/user-single.view.vue')
        }
      ]
    }
  ]
}

export { route }
