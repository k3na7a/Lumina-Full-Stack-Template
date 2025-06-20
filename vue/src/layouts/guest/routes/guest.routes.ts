import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  component: () => import('@/shared/layouts/guest/guest.view.vue'),
  children: [
    {
      path: '/account-recovery',
      name: ROUTE_NAMES.ACCOUNT_RECOVERY,
      meta: { pageTitle: 'Account Recovery' },
      component: () => import('@/pages/account-recovery/account-recovery.view.vue')
    },
    {
      path: '/password-reset',
      name: ROUTE_NAMES.PASSWORD_RESET,
      meta: { pageTitle: 'Password Reset' },
      component: () => import('@/pages/password-reset/password-reset.view.vue'),
      beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (!to.query.hasOwnProperty('reset_token')) next({ name: ROUTE_NAMES.HOME })
        else next()
      }
    }
  ]
}
export default route
