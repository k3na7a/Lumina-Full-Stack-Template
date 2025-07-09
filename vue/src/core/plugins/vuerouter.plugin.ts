import { App } from 'vue'
import {
  RouteLocationNormalized,
  RouteRecordRaw,
  Router,
  RouterOptions,
  createRouter,
  createWebHistory
} from 'vue-router'

class VueRouterService {
  private static $router: Router = createRouter({
    history: createWebHistory(),
    routes: [] as Array<RouteRecordRaw>
  } as RouterOptions)

  public static init(app: App<Element>, routes: RouteRecordRaw[]): void {
    for (const route of routes) this.$router.addRoute(route as RouteRecordRaw)

    this.$router.beforeResolve((to: RouteLocationNormalized) => {
      document.title = `${to.meta.pageTitle} - ${process.env.TITLE}`

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
