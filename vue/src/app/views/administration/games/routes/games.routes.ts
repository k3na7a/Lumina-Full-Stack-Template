import { ROUTE_NAMES } from '@/app/router/routes'
import { RouteRecordRaw } from 'vue-router'

const route: RouteRecordRaw = {
  path: 'game-library',
  redirect: { name: ROUTE_NAMES.ADMIN_GAMES },
  component: () => import('@/app/views/administration/games/games.view.vue'),
  children: [
    {
      path: 'games',
      name: ROUTE_NAMES.ADMIN_GAMES,
      component: () => import('@/app/views/administration/games/pages/games.view.vue')
    }
  ]
}

export { route }
