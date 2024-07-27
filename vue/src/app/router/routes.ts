import { RouteRecordRaw } from 'vue-router'

import { AuthStore, useAuthStore } from '../store/authentication.store'

export enum ROUTE_NAMES {
  HOME = 'home',
  FOLLOWING = 'following',
  BROWSE = 'browse',
  SETTINGS = 'settings'
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
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
        path: '/',
        beforeEnter: (_to, _from, next): void => {
          const authStore: AuthStore = useAuthStore()

          if (!authStore.$authenticated) next({ name: ROUTE_NAMES.HOME })
          else next()
        },
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
            component: () => import('@/app/views/home/home.view.vue'),
            children: []
          }
        ]
      }
    ]
  }
]
