import { createApp } from 'vue'

import '@/library/sass/style.scss'

import App from '@/app/views/app.view.vue'

import { FontAwesomeService as FontAwesome } from '@/plugins/fontawesome.plugin'
import { PiniaService as Pinia } from '@/plugins/pinia.plugin'
import { I18nService as I18n } from '@/plugins/vuei18n.plugin'
import { VueRouterService as Router } from '@/plugins/vuerouter.plugin'

import { routes } from '@/library/router/routes'
import { Ckeditor5Service } from './plugins/ckeditor5.plugin'
import { CustomDirectiveService } from './plugins/custom-directives.plugin'

async function bootstrap(): Promise<void> {
  const app = createApp(App)
  const debug: boolean = false

  Pinia.init(app)
  Router.init(app, routes, debug)
  I18n.init(app)
  FontAwesome.init(app)
  Ckeditor5Service.init(app)
  CustomDirectiveService.init(app)

  app.mount('#app')
}

bootstrap()
