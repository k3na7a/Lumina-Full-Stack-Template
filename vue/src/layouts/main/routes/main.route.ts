import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/core/enums/route-names.enum'

import home from '@/features/home/routes/home.routes'
import settings from '@/shared/layouts/settings/routes/settings.routes'
import admin from '@/shared/layouts/admin/routes/administration.routes'
import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

const routes: RouteRecordRaw = {
  path: '/',
  redirect: { name: ROUTE_NAMES.HOME },
  component: () => import('@/shared/layouts/main/main.layout.vue'),
  beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore: AuthStore = useAuthStore()
    await authStore.verifyToken().catch(() => console.warn('[Auth] Failed to initialize user session.'))
    next()
  },
  children: [home, settings, admin]
}

export default routes
