import { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/library/data/enums/route-names.enum'

import main from '@/app/layouts/main/routes/main.route'
import guest from '@/app/layouts/guest/routes/guest.routes'

const routes: RouteRecordRaw[] = [
  guest,
  main,
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.HOME }
  }
]

export { routes, ROUTE_NAMES }
