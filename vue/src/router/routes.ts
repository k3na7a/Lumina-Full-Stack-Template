import { RouteRecordRaw } from 'vue-router'

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
    component: () => import('@/layouts/main-navigation/main.layout.vue'),
    children: [
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/home/home.view.vue'),
        meta: {
          pageTitle: 'Home'
        }
      },
      {
        path: '/browse',
        name: ROUTE_NAMES.BROWSE,
        meta: {
          pageTitle: 'Browse'
        },
        component: () => import('@/views/home/home.view.vue')
      },
      {
        path: '/authenticated-routes',
        component: () => import('@/layouts/authenticated-routes/auth.layout.vue'),
        children: [
          {
            path: '/following',
            name: ROUTE_NAMES.FOLLOWING,
            meta: {
              pageTitle: 'Following'
            },
            component: () => import('@/views/home/home.view.vue')
          },
          {
            path: '/settings',
            name: ROUTE_NAMES.SETTINGS,
            redirect: { name: ROUTE_NAMES.PROFILE },
            component: () => import('@/views/settings/settings.view.vue'),
            children: [
              {
                path: 'profile',
                name: ROUTE_NAMES.PROFILE,
                component: () => import('@/views/settings/profile/profile.view.vue'),
                meta: {
                  pageTitle: 'Profile'
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
