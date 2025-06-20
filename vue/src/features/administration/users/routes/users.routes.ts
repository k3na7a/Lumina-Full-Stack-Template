import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'user-management',
  redirect: { name: ROUTE_NAMES.ADMIN_USERS },
  component: () => import('@/features/administration/users/users.view.vue'),
  children: [
    {
      path: 'users',
      redirect: { name: ROUTE_NAMES.ADMIN_USERS },
      children: [
        {
          path: '',
          name: ROUTE_NAMES.ADMIN_USERS,
          component: () => import('@/features/administration/users/pages/user-table.view.vue')
        },
        {
          path: ':id',
          name: ROUTE_NAMES.ADMIN_USERS_SINGLE,
          component: () => import('@/features/administration/users/pages/user-single.view.vue')
        }
      ]
    }
  ]
}

export { route }
