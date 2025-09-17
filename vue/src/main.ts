import { createApp } from 'vue'

import '@/shared/sass/style.scss'

import App from '@/app.view.vue'

import { FontAwesomeService as FontAwesome } from '@/plugins/fontawesome.plugin'
import { PiniaService as Pinia } from '@/plugins/pinia.plugin'
import { I18nService as I18n } from '@/plugins/vuei18n.plugin'
import { VueRouterService as Router } from '@/plugins/vuerouter.plugin'

import { routes } from '@/core/router/routes'
import { Ckeditor5Service } from './plugins/ckeditor5.plugin'
import { CustomDirectiveService } from './plugins/custom-directives.plugin'

async function bootstrap(): Promise<void> {
  const app = createApp(App)

  Pinia.init(app)
  Router.init(app, routes)
  I18n.init(app)
  FontAwesome.init(app)
  Ckeditor5Service.init(app)
  CustomDirectiveService.init(app)

  app.mount('#app')
}

bootstrap()
