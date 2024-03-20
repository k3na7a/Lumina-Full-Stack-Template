import { App } from 'vue'
import { I18nOptions, createI18n } from 'vue-i18n'

import { ILocalStorageUtil, useLocalStorageUtil } from '../helpers/utils/local-storage.util'

const TOKEN: string = 'i18n-locale'
type locales = 'en' | 'fr'

const config: I18nOptions = {
  legacy: true,
  fallbackLocale: 'en',
  locale: useLocalStorageUtil(TOKEN).getItem<string>() || 'en',
  messages: {
    en: {
      message: {
        hello: 'Hello World!'
      }
    },
    fr: {
      message: {
        hello: 'Bonjour!'
      }
    }
  }
}

class I18nService {
  private static $i18n = createI18n(config)
  private static $localStorage: ILocalStorageUtil = useLocalStorageUtil(TOKEN)

  public static init(app: App<Element>): void {
    app.use(this.$i18n)
  }

  public static changeLocale(language: locales): void {
    this.$localStorage.saveItem(language)
    this.$i18n.global.locale = language
  }
}

export { I18nService }
