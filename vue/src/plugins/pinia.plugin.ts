import { Pinia, createPinia } from 'pinia'
import { App } from 'vue'

class PiniaService {
  private static $pinia: Pinia = createPinia()

  public static async init(app: App<Element>): Promise<void> {
    app.use(this.$pinia)
  }
}

export { PiniaService }
