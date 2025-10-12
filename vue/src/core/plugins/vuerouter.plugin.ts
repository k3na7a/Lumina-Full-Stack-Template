import { ROUTE_NAMES } from "@lib/enums/route-names.enum";
import { Domain } from "@lib/dto/audit.dto";
import { App } from "vue";
import {
  RouteLocationNormalized,
  Router,
  RouterOptions,
  createRouter,
  createWebHistory,
  useRoute,
} from "vue-router";

import "vue-router";

import { routes } from "../router/routes";

export interface Breadcrumb {
  name: string;
  to: ROUTE_NAMES | null;
}

export interface ActivityMeta {
  title: string;
  subtitle: string;
  domain?: Domain;
}

declare module "vue-router" {
  interface RouteMeta {
    pageTitle?: string;
    breadcrumbs?: Breadcrumb[];
    activityLog?: ActivityMeta;
  }
}

type RouteWithActivity = ReturnType<typeof useRoute> & {
  meta: { activityLog: ActivityMeta };
};

export function useActivityRoute(): RouteWithActivity {
  const route = useRoute();
  if (!("activityLog" in route.meta))
    throw new Error(
      `[activities] Missing meta.activityLog on route "${
        String(route.name) ?? route.path
      }"`
    );
  return route as RouteWithActivity;
}

class VueRouterService {
  private static $router: Router = createRouter({
    history: createWebHistory(),
    routes,
  } as RouterOptions);

  public static init(app: App<Element>): void {
    this.$router.beforeResolve((_to: RouteLocationNormalized) => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      } as ScrollToOptions);
    });

    app.use(this.$router as Router);
  }
}

export { VueRouterService };
