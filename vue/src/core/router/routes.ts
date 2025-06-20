import { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/enums/route-names.enum'

import main from '@/shared/layouts/main/routes/main.route'
import guest from '@/shared/layouts/guest/routes/guest.routes'

const routes: RouteRecordRaw[] = [
  main,
  guest,
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes, ROUTE_NAMES }
