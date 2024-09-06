import { App } from 'vue'
import { I18nOptions, createI18n } from 'vue-i18n'

import { ILocalStorageUtil, useLocalStorageUtil } from '@/library/helpers/local-storage.util'

import en from '@/library/locales/en/en.js'
import es from '@/library/locales/es/es.json'
import fr from '@/library/locales/fr/fr.json'

const TOKEN: string = 'i18n-locale'
type locales = 'en' | 'es' | 'fr'

type Ilocales = { [id: string]: { display: string; key: locales; flag: string } }

const LOCALES: Ilocales = {
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

const config: I18nOptions = {
  legacy: true,
  fallbackLocale: 'en',
  locale: useLocalStorageUtil(TOKEN).getItem<string>() || 'en',
  messages: {
    en,
    es,
    fr
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

export { I18nService, LOCALES }
export type { locales }
