import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.ADMINISTRATION },
  component: () => import('@/shared/components/guards/is-administrator.guard.vue'),
  children: [
    {
      path: '/administration',
      name: ROUTE_NAMES.ADMINISTRATION,
      redirect: { name: ROUTE_NAMES.ADMIN_DASHBOARD },
      meta: { pageTitle: 'Administration' },
      component: () => import('@/features/administration/admin.view.vue'),
      children: [
        {
          path: 'dashboard',
          name: ROUTE_NAMES.ADMIN_DASHBOARD,
          component: () => import('@/pages/home/home.view.vue')
        },
        {
          path: 'user-management',
          redirect: { name: ROUTE_NAMES.ADMIN_USERS },
          component: () => import('@/features/administration/pages/users/users.view.vue'),
          children: [
            {
              path: 'users',
              redirect: { name: ROUTE_NAMES.ADMIN_USERS },
              children: [
                {
                  path: '',
                  name: ROUTE_NAMES.ADMIN_USERS,
                  component: () => import('@/features/administration/pages/users/pages/user-table.view.vue'),
                  meta: {
                    breadcrumbs: [
                      { name: 'Home', to: ROUTE_NAMES.HOME },
                      { name: 'Administration', to: ROUTE_NAMES.ADMINISTRATION },
                      { name: 'User Management', to: ROUTE_NAMES.ADMIN_USERS },
                      { name: 'Users', to: null }
                    ]
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'games-and-software',
          name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
          redirect: { name: ROUTE_NAMES.ADMIN_GAMES },
          component: () => import('@/features/administration/pages/games/games.view.vue'),
          children: [
            {
              path: 'games',
              name: ROUTE_NAMES.ADMIN_GAMES,
              component: () => import('@/features/administration/pages/games/pages/games-table.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'Home', to: ROUTE_NAMES.HOME },
                  { name: 'Administration', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'Games & Software', to: ROUTE_NAMES.ADMIN_GAMES },
                  { name: 'Games & Software', to: null }
                ]
              }
            },
            {
              path: 'platforms',
              name: ROUTE_NAMES.ADMIN_PLATFORMS,
              component: () => import('@/features/administration/pages/games/pages/platforms-table.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'Home', to: ROUTE_NAMES.HOME },
                  { name: 'Administration', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'Games & Software', to: ROUTE_NAMES.ADMIN_GAMES },
                  { name: 'Platforms', to: null }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}

export default route
