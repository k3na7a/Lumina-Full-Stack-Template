import { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { useLocalStorageUtil } from '@lib/utilities/local-storage.util'
import { messages } from '@lib/locales'

const TOKEN: string = 'i18n-locale'

class I18nService {
  private static $i18n = createI18n({
    legacy: false,
    fallbackLocale: 'en',
    globalInjection: true,
    locale: useLocalStorageUtil(TOKEN).getItem<string>() || 'en',
    messages
  })

  public static init(app: App<Element>): void {
    app.use(this.$i18n)
  }
}

export { I18nService, TOKEN }
