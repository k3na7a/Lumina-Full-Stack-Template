import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export enum ROUTE_NAMES {
  HOME = 'home',
  APPLICATIONS = 'applications',
  GAMES = 'games',
  GAMES_LIST = 'games-list',
  GAMES_SINGLE = 'games-single',
  BROWSE = 'browse',
  ADMINISTRATION = 'administration',
  ADMIN_USERS = 'user-administration',
  ADMIN_USER_LIST = 'user-list-administration',
  ADMIN_USER_SINGLE = 'user-single-administration',
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
        path: '/games',
        name: ROUTE_NAMES.GAMES,
        redirect: { name: ROUTE_NAMES.GAMES_LIST },
        meta: { pageTitle: 'Games' },
        component: () => import('@/views/games/games.view.vue'),
        children: [
          {
            path: '',
            name: ROUTE_NAMES.GAMES_LIST,
            component: () => import('@/views/home/home.view.vue')
          },
          {
            path: ':id',
            name: ROUTE_NAMES.GAMES_SINGLE,
            component: () => import('@/views/home/home.view.vue')
          }
        ]
      },
      {
        path: '/applications',
        name: ROUTE_NAMES.APPLICATIONS,
        component: () => import('@/views/home/home.view.vue')
      },
      {
        path: '/authenticated-routes',
        component: () => import('@/layouts/authenticated-routes/auth.layout.vue'),
        children: [
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
            redirect: { name: ROUTE_NAMES.ADMIN_USERS },
            meta: { pageTitle: 'Administration' },
            component: () => import('@/views/administration/administration.view.vue'),
            children: [
              {
                path: 'users',
                name: ROUTE_NAMES.ADMIN_USERS,
                redirect: { name: ROUTE_NAMES.ADMIN_USER_LIST },
                children: [
                  {
                    path: '',
                    name: ROUTE_NAMES.ADMIN_USER_LIST,
                    component: () => import('@/views/administration/users/user-list.view.vue')
                  },
                  {
                    path: ':id',
                    name: ROUTE_NAMES.ADMIN_USER_SINGLE,
                    component: () => import('@/views/administration/users/user-single.view.vue')
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
    path: '/guest-routes',
    component: () => import('@/layouts/guest-routes/guest.layout.vue'),
    redirect: { name: ROUTE_NAMES.HOME },
    children: [
      {
        path: '/account-recovery',
        name: ROUTE_NAMES.ACCOUNT_RECOVERY,
        meta: { pageTitle: 'Account Recovery' },
        component: () => import('@/views/guest/account-recovery.view.vue')
      },
      {
        path: '/password-reset',
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
