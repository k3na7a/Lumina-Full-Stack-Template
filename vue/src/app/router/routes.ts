import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../store/authentication.store'
import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.HOME },
    component: () => import('@/app/layouts/main-navigation/main.layout.vue'),
    beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore = useAuthStore()
      await authStore.init().catch(() => console.log('Could not authenticate.'))
      next()
    },
    children: [
      {
        path: '/home',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/app/views/home/home.view.vue'),
        meta: { pageTitle: 'Home' }
      },
      {
        path: '/games',
        name: ROUTE_NAMES.GAMES,
        redirect: { name: ROUTE_NAMES.GAMES_LIST },
        meta: { pageTitle: 'Games' },
        component: () => import('@/app/views/games/games.view.vue'),
        children: [
          {
            path: '',
            name: ROUTE_NAMES.GAMES_LIST,
            component: () => import('@/app/views/home/home.view.vue')
          },
          {
            path: ':id',
            name: ROUTE_NAMES.GAMES_SINGLE,
            component: () => import('@/app/views/home/home.view.vue')
          }
        ]
      },
      {
        path: '/applications',
        name: ROUTE_NAMES.APPLICATIONS,
        component: () => import('@/app/views/home/home.view.vue')
      },
      {
        path: '/authenticated-routes',
        redirect: { name: ROUTE_NAMES.HOME },
        component: () => import('@/app/layouts/authenticated-routes/auth.layout.vue'),
        children: [
          {
            path: '/settings',
            name: ROUTE_NAMES.SETTINGS,
            redirect: { name: ROUTE_NAMES.PROFILE },
            component: () => import('@/app/views/settings/settings.view.vue'),
            meta: { pageTitle: 'Settings' },
            children: [
              {
                path: 'profile',
                name: ROUTE_NAMES.PROFILE,
                component: () => import('@/app/views/settings/pages/profile.view.vue')
              },
              {
                path: 'security',
                name: ROUTE_NAMES.SECURITY,
                component: () => import('@/app/views/settings/pages/security.view.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/administration-routes',
        redirect: { name: ROUTE_NAMES.ADMINISTRATION },
        component: () => import('@/app/layouts/administration-routes/administration.layout.vue'),
        children: [
          {
            path: '/administration',
            name: ROUTE_NAMES.ADMINISTRATION,
            redirect: { name: ROUTE_NAMES.ADMIN_USERS },
            meta: { pageTitle: 'Administration' },
            component: () => import('@/app/views/administration/administration.view.vue'),
            children: [
              {
                path: 'users',
                name: ROUTE_NAMES.ADMIN_USERS,
                redirect: { name: ROUTE_NAMES.ADMIN_USER_LIST },
                children: [
                  {
                    path: '',
                    name: ROUTE_NAMES.ADMIN_USER_LIST,
                    component: () => import('@/app/views/administration/pages/users.view.vue')
                  }
                ]
              },
              {
                path: 'games',
                name: ROUTE_NAMES.ADMIN_GAMES,
                redirect: { name: ROUTE_NAMES.ADMIN_GAMES_LIST },
                component: () => import('@/app/views/administration/pages/game-library.view.vue'),
                children: [
                  {
                    path: '',
                    name: ROUTE_NAMES.ADMIN_GAMES_LIST,
                    component: () =>
                      import('@/app/views/administration/components/tables/games.component.vue')
                  },
                  {
                    path: 'platforms',
                    name: ROUTE_NAMES.ADMIN_GAMES_PLATFORMS_LIST,
                    component: () => import('@/app/views/administration/components/tables/platforms.component.vue')
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
    component: () => import('@/app/layouts/guest-routes/guest.layout.vue'),
    redirect: { name: ROUTE_NAMES.HOME },
    children: [
      {
        path: '/account-recovery',
        name: ROUTE_NAMES.ACCOUNT_RECOVERY,
        meta: { pageTitle: 'Account Recovery' },
        component: () => import('@/app/views/guest/pages/account-recovery.view.vue')
      },
      {
        path: '/password-reset',
        name: ROUTE_NAMES.PASSWORD_RESET,
        meta: { pageTitle: 'Password Reset' },
        component: () => import('@/app/views/guest/pages/password-reset.view.vue'),
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

export { routes, ROUTE_NAMES }
