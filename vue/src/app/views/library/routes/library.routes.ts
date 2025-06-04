import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/library',
  name: ROUTE_NAMES.LIBRARY,
  component: () => import('@/app/views/home/home.view.vue'),
  meta: { pageTitle: 'Library' }
}

export default route
