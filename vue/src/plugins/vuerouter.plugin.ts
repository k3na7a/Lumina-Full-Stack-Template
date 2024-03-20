import { App } from 'vue'
import { RouteRecordRaw, Router, RouterOptions, createRouter, createWebHistory } from 'vue-router'

class VueRouterService {
  public static $router: Router = createRouter({
    history: createWebHistory(),
    routes: [] as Array<RouteRecordRaw>
  } as RouterOptions)

  public static init(app: App<Element>, routes: RouteRecordRaw[]): void {
    for (const route of routes) {
      this.$router.addRoute(route as RouteRecordRaw)
    }

    this.$router.beforeEach(async (to, _from, next) => {
      document.title = `${to.meta.pageTitle}`

      next()
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
