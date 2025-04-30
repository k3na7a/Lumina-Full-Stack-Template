import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/account-recovery',
  name: ROUTE_NAMES.ACCOUNT_RECOVERY,
  meta: { pageTitle: 'Account Recovery' },
  component: () => import('@/app/views/guest/pages/account-recovery.view.vue')
}

export default route
