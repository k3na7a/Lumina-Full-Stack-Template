import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/home',
  name: ROUTE_NAMES.HOME,
  component: () => import('@/app/views/home/home.view.vue'),
  meta: { pageTitle: 'Home' }
}

export default route
