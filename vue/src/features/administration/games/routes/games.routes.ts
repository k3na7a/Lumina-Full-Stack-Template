import { ROUTE_NAMES } from '@/core/enums/route-names.enum'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'games-and-software',
  name: ROUTE_NAMES.ADMIN_GAMES_AND_SOFTWARE,
  redirect: { name: ROUTE_NAMES.ADMIN_GAMES },
  component: () => import('@/features/administration/games/games.view.vue'),
  children: [
    {
      path: 'games',
      name: ROUTE_NAMES.ADMIN_GAMES,
      component: () => import('@/features/administration/games/pages/games-table.view.vue')
    },
    {
      path: 'platforms',
      name: ROUTE_NAMES.ADMIN_PLATFORMS,
      component: () => import('@/features/administration/games/pages/platforms-table.view.vue')
    }
  ]
}

export { route }
