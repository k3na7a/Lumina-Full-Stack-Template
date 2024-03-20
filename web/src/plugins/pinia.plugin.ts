import { Pinia, createPinia } from 'pinia'
import { App } from 'vue'

class PiniaService {
  private static $pinia: Pinia = createPinia()

  public static init(app: App<Element>): void {
    app.use(this.$pinia)
  }
}

export { PiniaService }
