import { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/router/route-names.enum'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.HOME },
  component: () => import('@/shared/components/guards/is-authenticated.guard.vue'),
  children: [
    {
      path: '/settings',
      name: ROUTE_NAMES.SETTINGS,
      redirect: { name: ROUTE_NAMES.PROFILE },
      component: () => import('@/features/settings/settings.view.vue'),
      meta: { pageTitle: 'Settings' },
      children: [
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('@/features/settings/pages/profile.view.vue')
        },
        {
          path: 'security',
          name: ROUTE_NAMES.SECURITY,
          component: () => import('@/features/settings/pages/security.view.vue')
        }
      ]
    }
  ]
}

export default route
