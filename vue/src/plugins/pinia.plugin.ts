import { Pinia, createPinia } from 'pinia'
import { App } from 'vue'

import { useAuthStore } from '@/store/authentication.store'

class PiniaService {
  private static $pinia: Pinia = createPinia()

  public static async init(app: App<Element>): Promise<void> {
    app.use(this.$pinia)
    await useAuthStore().init()
  }
}

export { PiniaService }
