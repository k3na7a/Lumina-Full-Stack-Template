import { Pinia, createPinia } from 'pinia'
import { App } from 'vue'

import { useAuthStore } from '@/store/authentication.store'
import { AxiosError } from 'axios'

class PiniaService {
  private static $pinia: Pinia = createPinia()

  public static async init(app: App<Element>): Promise<void> {
    app.use(this.$pinia)
    await useAuthStore()
      .init()
      .catch((error: AxiosError) => console.log('Could not Authenticate:', error))
  }
}

export { PiniaService }
