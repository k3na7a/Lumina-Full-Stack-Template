import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/home',
  name: ROUTE_NAMES.HOME,
  component: () => import('@/features/home/home.view.vue'),
  meta: { pageTitle: 'Home' }
}

export default route
