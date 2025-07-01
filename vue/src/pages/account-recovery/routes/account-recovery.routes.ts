import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'


const route: RouteRecordRaw = {
  path: '/account-recovery',
  name: ROUTE_NAMES.ACCOUNT_RECOVERY,
  meta: { pageTitle: 'Account Recovery' },
  component: () => import('@/pages/account-recovery/account-recovery.view.vue')
}

export default route
