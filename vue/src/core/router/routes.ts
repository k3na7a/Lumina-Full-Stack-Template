import { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/core/router/route-names.enum'

import home from '@/features/home/routes/home.routes'
import settings from '@/features/settings/routes/settings.routes'
import admin from '@/features/administration/routes/administration.routes'

import accountRecovery from '@/pages/account-recovery/routes/account-recovery.routes'
import passwordReset from '@/pages/password-reset/routes/password-reset.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: ROUTE_NAMES.HOME },
    component: () => import('@/shared/layouts/main/main.view.vue'),
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
