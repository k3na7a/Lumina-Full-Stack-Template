import en from '@/shared/locales/en/en'
import fr from '@/shared/locales/fr/fr'
import es from '@/shared/locales/es/es'
import de from '@/shared/locales/de/de'
import ja from '@/shared/locales/ja/ja'
import ar from '@/shared/locales/ar/ar'

type locales = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar'
const LOCALES: { [id: string]: { display: string; key: locales; flag: string } } = {
  en: {
    display: 'English',
    key: 'en',
    flag: '/media/flags/united-kingdom.svg'
  },
  fr: {
    display: 'Français',
    key: 'fr',
    flag: '/media/flags/france.svg'
  },
  es: {
    display: 'Español',
    key: 'es',
    flag: '/media/flags/spain.svg'
  },
  de: {
    display: 'Deutsch',
    key: 'de',
    flag: '/media/flags/germany.svg'
  },
    ar: {
    display: 'العربية',
    key: 'ar',
    flag: '/media/flags/saudi-arabia.svg'
  },
  ja: {
    display: '日本語',
    key: 'ja',
    flag: '/media/flags/japan.svg'
  },
}

const messages = {
  en,
  fr,
  es,
  de,
  ja,
  ar
}

export type { locales }
export { messages, LOCALES }
