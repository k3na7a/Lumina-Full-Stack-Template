import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export enum ROUTE_NAMES {
  HOME = 'home',
  FOLLOWING = 'following',
  BROWSE = 'browse',
  ADMINISTRATION = 'administration',
  ADMIN_DASHBOARD = 'administration-dashboard',
  ADMIN_USERS = 'user-administration',
  SETTINGS = 'settings',
  SECURITY = 'security',
  PROFILE = 'profile',
  ACCOUNT_RECOVERY = 'account-recovery',
  PASSWORD_RESET = 'password-reset'
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
        meta: { pageTitle: 'Home' }
      },
      {
        path: '/browse',
        name: ROUTE_NAMES.BROWSE,
        meta: { pageTitle: 'Browse' },
        component: () => import('@/views/home/home.view.vue')
      },
      {
        path: '/authenticated-routes',
        component: () => import('@/layouts/authenticated-routes/auth.layout.vue'),
        children: [
          {
            path: '/following',
            name: ROUTE_NAMES.FOLLOWING,
            meta: { pageTitle: 'Following' },
            component: () => import('@/views/home/home.view.vue')
          },
          {
            path: '/settings',
            name: ROUTE_NAMES.SETTINGS,
            redirect: { name: ROUTE_NAMES.PROFILE },
            component: () => import('@/views/settings/settings.view.vue'),
            meta: { pageTitle: 'Settings' },
            children: [
              {
                path: 'profile',
                name: ROUTE_NAMES.PROFILE,
                component: () => import('@/views/settings/profile/profile.view.vue')
              },
              {
                path: 'security',
                name: ROUTE_NAMES.SECURITY,
                component: () => import('@/views/settings/security/security.view.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/administration-routes',
        redirect: { name: ROUTE_NAMES.ADMINISTRATION },
        component: () => import('@/layouts/administration-routes/administration.layout.vue'),
        children: [
          {
            path: '/administration',
            name: ROUTE_NAMES.ADMINISTRATION,
            redirect: { name: ROUTE_NAMES.ADMIN_DASHBOARD },
            meta: { pageTitle: 'Administration' },
            component: () => import('@/views/administration/administration.view.vue'),
            children: [
              {
                path: 'dashboard',
                name: ROUTE_NAMES.ADMIN_DASHBOARD,
                component: () => import('@/views/home/home.view.vue')
              },
              {
                path: 'users',
                redirect: { name: ROUTE_NAMES.ADMIN_USERS },
                children: [
                  {
                    path: '',
                    name: ROUTE_NAMES.ADMIN_USERS,
                    component: () => import('@/views/home/home.view.vue')
                  },
                  {
                    path: ':id',
                    component: () => import('@/views/settings/profile/profile.view.vue')
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/guest',
    component: () => import('@/layouts/guest-routes/guest.layout.vue'),
    redirect: { name: ROUTE_NAMES.HOME },
    children: [
      {
        path: 'account-recovery',
        name: ROUTE_NAMES.ACCOUNT_RECOVERY,
        meta: { pageTitle: 'Account Recovery' },
        component: () => import('@/views/guest/account-recovery.view.vue')
      },
      {
        path: 'password-reset',
        name: ROUTE_NAMES.PASSWORD_RESET,
        meta: { pageTitle: 'Password Reset' },
        component: () => import('@/views/guest/password-reset.view.vue'),
        beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
          if (!to.query.hasOwnProperty('reset_token')) next({ name: ROUTE_NAMES.HOME })
          else next()
        }
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]
