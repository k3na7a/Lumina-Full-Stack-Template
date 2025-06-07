import { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'

import main from '@/app/layouts/main/routes/main.route'

import accountrecovery from '../views/guest/routes/account-recovery.routes'
import passwordreset from '../views/guest/routes/password-reset.routes'

const routes: RouteRecordRaw[] = [
  main,
  {
    path: '/',
    component: () => import('@/app/views/guest/guest.view.vue'),
    children: [accountrecovery, passwordreset]
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes, ROUTE_NAMES }

