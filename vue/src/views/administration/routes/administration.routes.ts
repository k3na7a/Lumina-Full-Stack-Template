import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

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
      component: () => import('@/views/administration/admin.view.vue'),
      children: [
        {
          path: 'user-management',
          redirect: { name: ROUTE_NAMES.ADMIN_USERS },
          component: () => import('@/views/administration/pages/users/users.view.vue'),
          children: [
            {
              path: 'users',
              redirect: { name: ROUTE_NAMES.ADMIN_USERS },
              children: [
                {
                  path: '',
                  name: ROUTE_NAMES.ADMIN_USERS,
                  component: () => import('@/views/administration/pages/users/pages/user-table.view.vue')
                }
              ]
            }
          ]
        },
        {
          path: 'games-and-software',
          name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
          redirect: { name: ROUTE_NAMES.ADMIN_GAMES },
          component: () => import('@/views/administration/pages/games/games.view.vue'),
          children: [
            {
              path: 'games',
              name: ROUTE_NAMES.ADMIN_GAMES,
              component: () => import('@/views/administration/pages/games/pages/games-table.view.vue')
            },
            {
              path: 'platforms',
              name: ROUTE_NAMES.ADMIN_PLATFORMS,
              component: () => import('@/views/administration/pages/games/pages/platforms-table.view.vue')
            }
          ]
        }
      ]
    }
  ]
}

export default route
