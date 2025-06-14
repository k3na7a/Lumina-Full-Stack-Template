import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/app/router/routes'
import { useAuthStore } from '@/app/store/authentication.store'

import home from '../../../views/home/routes/home.routes'
import settings from '../../settings/routes/settings.routes'
import admin from '../../admin/routes/administration.routes'

const routes: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.HOME },
  component: () => import('@/app/layouts/main/main.layout.vue'),
  beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    await authStore.verifyToken().catch(() => console.warn('[Auth] Failed to initialize user session.'))
    next()
  },
  children: [home, settings, admin]
}

export default routes
