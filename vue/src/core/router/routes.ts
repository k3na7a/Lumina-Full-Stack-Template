import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import { AuthStore, useAuthStore } from '@/core/store/authentication.store'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'

import home from '@/views/home/routes/home.routes'
import settings from '@/views/settings/routes/settings.routes'
import admin from '@/views/administration/routes/administration.routes'

import accountRecovery from '@/views/guest/account-recovery/routes/account-recovery.routes'
import passwordReset from '@/views/guest/password-reset/routes/password-reset.routes'

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
    path: '/user',
    component: () => import('@/shared/layouts/guest/guest.view.vue'),
    children: [accountRecovery, passwordReset]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes }
