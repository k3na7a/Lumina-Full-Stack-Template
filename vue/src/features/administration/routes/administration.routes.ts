import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/core/router/route-names.enum'

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
          redirect: { name: ROUTE_NAMES.ADMIN_DASHBOARD_OVERVIEW },
          component: () => import('@/features/administration/pages/dashboard/dashboard.view.vue'),
          children: [
            {
              path: 'overview',
              name: ROUTE_NAMES.ADMIN_DASHBOARD_OVERVIEW,
              component: () => import('@/features/home/home.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                  { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'administration.dashboard.label', to: ROUTE_NAMES.ADMIN_DASHBOARD },
                  { name: 'administration.dashboard.overview.label', to: null }
                ]
              }
            }
          ]
        },
        {
          path: 'user-management',
          name: ROUTE_NAMES.ADMIN_USER_MANAGEMENT,
          redirect: { name: ROUTE_NAMES.ADMIN_USERS },
          component: () => import('@/features/administration/pages/users/users.view.vue'),
          children: [
            {
              path: 'users',
              children: [
                {
                  path: '',
                  name: ROUTE_NAMES.ADMIN_USERS,
                  component: () => import('@/features/administration/pages/users/pages/user-table.view.vue'),
                  meta: {
                    breadcrumbs: [
                      { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                      { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                      { name: 'administration.user-management.header', to: ROUTE_NAMES.ADMIN_USERS },
                      { name: 'administration.user-management.users.label', to: null }
                    ]
                  }
                }
              ]
            },
            {
              path: 'roles',
              name: ROUTE_NAMES.ADMIN_USER_ROLES,
              component: () => import('@/features/administration/pages/users/pages/role-table.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                  { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'administration.user-management.header', to: ROUTE_NAMES.ADMIN_USERS },
                  { name: 'administration.user-management.roles.label', to: null }
                ]
              }
            },
            {
              path: 'permissions',
              name: ROUTE_NAMES.ADMIN_USER_PERMISSIONS,
              component: () => import('@/features/administration/pages/users/pages/permission-table.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                  { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'administration.user-management.header', to: ROUTE_NAMES.ADMIN_USERS },
                  { name: 'administration.user-management.permissions.label', to: null }
                ]
              }
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
                  { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                  { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'administration.games-and-software.header', to: ROUTE_NAMES.ADMIN_GAMES },
                  { name: 'administration.games-and-software.games.label', to: null }
                ]
              }
            },
            {
              path: 'platforms',
              name: ROUTE_NAMES.ADMIN_PLATFORMS,
              component: () => import('@/features/administration/pages/games/pages/platforms-table.view.vue'),
              meta: {
                breadcrumbs: [
                  { name: 'navigation.home', to: ROUTE_NAMES.HOME },
                  { name: 'administration.label', to: ROUTE_NAMES.ADMINISTRATION },
                  { name: 'administration.games-and-software.header', to: ROUTE_NAMES.ADMIN_GAMES },
                  { name: 'administration.games-and-software.platforms.label', to: null }
                ]
              }
            }
          ]
        },
        {
          path: '/:catchAll(.*)',
          redirect: { name: ROUTE_NAMES.ADMIN_DASHBOARD }
        }
      ]
    }
  ]
}

export default route
