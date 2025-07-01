import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

import home from '@/pages/home/routes/home.routes'
import settings from '@/features/settings/routes/settings.routes'
import admin from '@/features/administration/routes/administration.routes'

import accountRecovery from '@/pages/account-recovery/routes/account-recovery.routes'
import passwordReset from '@/pages/password-reset/routes/password-reset.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.HOME },
    component: () => import('@/shared/layouts/main/main.view.vue'),
    beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore: AuthStore = useAuthStore()
      await authStore.verifyToken().catch(() => console.warn('[Auth] Failed to initialize user session.'))
      next()
    },
    children: [home, settings, admin]
  },
  {
    path: '/guest',
    component: () => import('@/shared/layouts/guest/guest.view.vue'),
    children: [accountRecovery, passwordReset]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes }
