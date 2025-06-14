import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'games-and-software',
  redirect: { name: ROUTE_NAMES.ADMIN_GAMES },
  component: () => import('@/app/views/administration/games/games.view.vue'),
  children: [
    {
      path: 'games',
      name: ROUTE_NAMES.ADMIN_GAMES,
      component: () => import('@/app/views/administration/games/pages/games-table.view.vue')
    },
    {
      path: 'platforms',
      name: ROUTE_NAMES.ADMIN_PLATFORMS,
      component: () => import('@/app/views/administration/games/pages/platforms-table.view.vue')
    }
  ]
}

export { route }
