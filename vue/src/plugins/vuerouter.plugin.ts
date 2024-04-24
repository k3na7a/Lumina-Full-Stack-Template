import { App } from 'vue'
import { RouteRecordRaw, Router, RouterOptions, createRouter, createWebHistory } from 'vue-router'

import { AuthStore, useAuthStore } from '@/store/authentication.store'

declare module 'vue-router' {
  interface RouteMeta {
    isAdmin?: boolean
    pageTitle?: string
    breadcrumbs?: string[]
    requiresAuth?: boolean
    guest?: boolean
  }
}

class VueRouterService {
  private static $router: Router = createRouter({
    history: createWebHistory(),
    routes: [] as Array<RouteRecordRaw>
  } as RouterOptions)

  public static init(app: App<Element>, routes: RouteRecordRaw[]): void {
    const store: AuthStore = useAuthStore()

    for (const route of routes) {
      this.$router.addRoute(route as RouteRecordRaw)
    }

    this.$router.beforeEach(async (to, _from, next) => {
      document.title = `${to.meta.pageTitle} | ${process.env.TITLE}`

      if (to.matched.some((record) => record.meta['requiresAuth']) && !store.isAuthenticated)
        next({
          path: '/sign-in',
          query: { redirect: to.fullPath }
        })
      else if (to.matched.some((record) => record.meta['guest']) && store.isAuthenticated) next({ path: '/' })
      else next()

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      } as ScrollToOptions)
    })

    app.use(this.$router as Router)
  }
}

export { VueRouterService }
