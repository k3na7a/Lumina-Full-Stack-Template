import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './routes.enum'

const guest_routes: RouteRecordRaw = {
  path: '/guest-routes',
  component: () => import('@/app/layouts/guest-routes/guest.layout.vue'),
  redirect: { name: ROUTE_NAMES.HOME },
  children: [
    {
      path: '/account-recovery',
      name: ROUTE_NAMES.ACCOUNT_RECOVERY,
      meta: { pageTitle: 'Account Recovery' },
      component: () => import('@/app/views/guest/pages/account-recovery/account-recovery.view.vue')
    },
    {
      path: '/password-reset',
      name: ROUTE_NAMES.PASSWORD_RESET,
      meta: { pageTitle: 'Password Reset' },
      component: () => import('@/app/views/guest/pages/account-recovery/password-reset.view.vue'),
      beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (!to.query.hasOwnProperty('reset_token')) next({ name: ROUTE_NAMES.HOME })
        else next()
      }
    }
  ]
}

export { guest_routes }
