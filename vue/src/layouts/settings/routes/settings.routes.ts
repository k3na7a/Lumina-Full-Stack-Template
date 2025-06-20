import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.HOME },
  component: () => import('@/core/router/guards/is-authenticated.guard.vue'),
  children: [
    {
      path: '/settings',
      name: ROUTE_NAMES.SETTINGS,
      redirect: { name: ROUTE_NAMES.PROFILE },
      component: () => import('@/shared/layouts/settings/settings.view.vue'),
      meta: { pageTitle: 'Settings' },
      children: [
        {
          path: 'profile',
          name: ROUTE_NAMES.PROFILE,
          component: () => import('@/features/settings/profile/profile.view.vue')
        },
        {
          path: 'security',
          name: ROUTE_NAMES.SECURITY,
          component: () => import('@/features/settings/security/security.view.vue')
        }
      ]
    }
  ]
}

export default route
