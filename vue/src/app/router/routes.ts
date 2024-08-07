import { RouteRecordRaw } from 'vue-router'

// import { AuthStore, useAuthStore } from '../store/authentication.store'

export enum ROUTE_NAMES {
  HOME = 'home',
  FOLLOWING = 'following',
  BROWSE = 'browse',
  SETTINGS = 'settings',
  PROFILE = 'profile'
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.HOME },
    component: () => import('@/app/layouts/main/main.layout.vue'),
    children: [
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/app/views/home/home.view.vue'),
        meta: {
          pageTitle: 'Home',
          breadcrumbs: ['Home']
        }
      },
      {
        path: '/browse',
        name: ROUTE_NAMES.BROWSE,
        meta: {
          pageTitle: 'Browse',
          breadcrumbs: ['Browse']
        },
        component: () => import('@/app/views/home/home.view.vue')
      },
      {
        path: '/authenticated-routes',
        component: () => import('@/app/layouts/auth/auth.layout.vue'),
        children: [
          {
            path: '/following',
            name: ROUTE_NAMES.FOLLOWING,
            meta: {
              pageTitle: 'Following',
              breadcrumbs: ['Following']
            },
            component: () => import('@/app/views/home/home.view.vue')
          },
          {
            path: '/settings',
            name: ROUTE_NAMES.SETTINGS,
            redirect: { name: ROUTE_NAMES.PROFILE },
            component: () => import('@/app/layouts/settings/settings.layout.vue'),
            children: [
              {
                path: 'profile',
                name: ROUTE_NAMES.PROFILE,
                component: () => import('@/app/views/settings/profile.view.vue'),
                meta: {
                  pageTitle: 'Profile',
                  breadcrumbs: ['Settings']
                }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/home'
  }
]
