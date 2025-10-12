import { createApp } from "vue";

import "./style.scss";

import App from "@/app.view.vue";

declare module "*.scss";

import { FontAwesomeService as FontAwesome } from "@/core/plugins/fontawesome.plugin";
import { PiniaService as Pinia } from "@/core/plugins/pinia.plugin";
import { I18nService as I18n } from "@/core/plugins/vuei18n.plugin";
import { VueRouterService as Router } from "@/core/plugins/vuerouter.plugin";
import { CustomDirectiveService } from "./core/plugins/custom-directives.plugin";

async function bootstrap(): Promise<void> {
  const app = createApp(App);

  Pinia.init(app);
  Router.init(app);
  I18n.init(app);
  FontAwesome.init(app);
  CustomDirectiveService.init(app);

  app.mount("#app");
}

bootstrap();
