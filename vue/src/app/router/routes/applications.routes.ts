import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/applications',
  name: ROUTE_NAMES.APPLICATIONS,
  component: () => import('@/app/views/home/home.view.vue')
}

export default route
