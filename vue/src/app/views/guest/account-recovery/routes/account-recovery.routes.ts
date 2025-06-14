import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes'

const route: RouteRecordRaw = {
  path: '/account-recovery',
  name: ROUTE_NAMES.ACCOUNT_RECOVERY,
  meta: { pageTitle: 'Account Recovery' },
  component: () => import('@/app/views/account-recovery/account-recovery.view.vue')
}

export default route
