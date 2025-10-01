import en from './en/en'
import fr from './fr/fr'
import es from './es/es'
import de from './de/de'
import ja from './ja/ja'
import ar from './ar/ar'
import uk from './uk/uk'

type locales = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar' | 'uk'
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
  ja: {
    display: '日本語',
    key: 'ja',
    flag: '/media/flags/japan.svg'
  },
  uk: {
    display: 'Українська',
    key: 'uk',
    flag: '/media/flags/ukraine.svg'
  },
  ar: {
    display: 'العربية',
    key: 'ar',  
    flag: '/media/flags/palestine.svg'
  }
}

const messages = {
  en,
  fr,
  es,
  de,
  ja,
  ar,
  uk
}

export type { locales }
export { messages, LOCALES }
