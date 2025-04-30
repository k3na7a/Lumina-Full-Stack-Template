import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/password-reset',
  name: ROUTE_NAMES.PASSWORD_RESET,
  meta: { pageTitle: 'Password Reset' },
  component: () => import('@/app/views/guest/pages/password-reset.view.vue'),
  beforeEnter: (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!to.query.hasOwnProperty('reset_token')) next({ name: ROUTE_NAMES.HOME })
    else next()
  }
}

export default route
