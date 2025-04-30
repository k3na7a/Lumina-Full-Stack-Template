import { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { useLocalStorageUtil } from '@/library/helpers/local-storage.util'

import en from '@/library/locales/en/en'
import es from '@/library/locales/es/es.json'
import fr from '@/library/locales/fr/fr.json'

const TOKEN: string = 'i18n-locale'
type locales = 'en' | 'es' | 'fr'

const LOCALES: { [id: string]: { display: string; key: locales; flag: string } } = {
  en: {
    display: 'English',
    key: 'en',
    flag: '/media/flags/united-kingdom.svg'
  },
  es: {
    display: 'Español',
    key: 'es',
    flag: '/media/flags/spain.svg'
  },
  fr: {
    display: 'Français',
    key: 'fr',
    flag: '/media/flags/france.svg'
  }
}

class I18nService {
  private static $i18n = createI18n({
    legacy: false,
    fallbackLocale: 'en',
    globalInjection: true,
    locale: useLocalStorageUtil(TOKEN).getItem<string>() || 'en',
    messages: {
      en,
      es,
      fr
    }
  })

  public static init(app: App<Element>): void {
    app.use(this.$i18n)
  }
}

export { I18nService, LOCALES, TOKEN }
export type { locales }
