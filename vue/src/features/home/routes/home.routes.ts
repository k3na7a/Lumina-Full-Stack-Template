import { ROUTE_NAMES } from '@/core/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/home',
  name: ROUTE_NAMES.HOME,
  component: () => import('@/features/home/home.view.vue'),
  meta: { pageTitle: 'Home' }
}

export default route
