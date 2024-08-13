import { createApp } from 'vue'
import { AxiosError } from 'axios'

import '@/sass/style.scss'

import App from '@/views/app.view.vue'

import { FontAwesomeService as FontAwesome } from '@/plugins/fontawesome.plugin'
import { PiniaService as Pinia } from '@/plugins/pinia.plugin'
import { I18nService as I18n } from '@/plugins/vuei18n.plugin'
import { VueRouterService as Router } from '@/plugins/vuerouter.plugin'

import { useAuthStore } from '@/store/authentication.store'

import { routes } from '@/router/routes'
import { registerDirectives } from '@/directives'

async function bootstrap(): Promise<void> {
  const app = createApp(App)
  const debug: boolean = true

  Pinia.init(app)
  Router.init(app, routes, debug)
  I18n.init(app)
  FontAwesome.init(app)

  registerDirectives(app)

  const authenticationStore = useAuthStore()
  await authenticationStore.init().catch((error: AxiosError) => console.log('Could not Authenticate:', error.message))

  app.mount('#app')
}

bootstrap()
