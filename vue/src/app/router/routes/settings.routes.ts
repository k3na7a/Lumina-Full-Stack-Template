import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.HOME },
  component: () => import('@/app/router/guards/is-authenticated.guard.vue'),
  children: [
    {
      path: '/settings',
      name: ROUTE_NAMES.SETTINGS,
      redirect: { name: ROUTE_NAMES.PROFILE },
      component: () => import('@/app/views/settings/settings.view.vue'),
      meta: { pageTitle: 'Settings' },
      children: [
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('@/app/views/settings/pages/profile.view.vue')
        },
        {
          path: 'security',
          name: ROUTE_NAMES.SECURITY,
          component: () => import('@/app/views/settings/pages/security.view.vue')
        }
      ]
    }
  ]
}

export default route
