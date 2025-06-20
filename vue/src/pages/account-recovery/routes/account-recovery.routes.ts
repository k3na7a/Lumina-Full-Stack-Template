import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/core/enums/route-names.enum'

const route: RouteRecordRaw = {
  path: '/account-recovery',
  name: ROUTE_NAMES.ACCOUNT_RECOVERY,
  meta: { pageTitle: 'Account Recovery' },
  component: () => import('@/features/guest/account-recovery/account-recovery.view.vue')
}

export default route
