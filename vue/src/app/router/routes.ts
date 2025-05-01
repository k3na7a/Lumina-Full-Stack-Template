import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../store/authentication.store'
import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'

import home from './routes/home.routes'
import applications from './routes/applications.routes'
import settings from './routes/settings.routes'
import admin from './routes/administration.routes'

import accountrecovery from './routes/account-recovery.routes'
import passwordreset from './routes/password-reset.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.HOME },
    component: () => import('@/app/layouts/main-navigation/main.layout.vue'),
    beforeEnter: async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const authStore = useAuthStore()
      await authStore.init().catch(() => console.log('Could not authenticate.'))
      next()
    },
    children: [home, applications, settings, admin]
  },
  {
    path: '/',
    component: () => import('@/app/views/guest/guest.layout.vue'),
    children: [accountrecovery, passwordreset]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes, ROUTE_NAMES }
