import en from '@/shared/locales/en/en'
import fr from '@/shared/locales/fr/fr'
import es from '@/shared/locales/es/es'

type locales = 'en' | 'es' | 'fr'
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
  }
}

const messages = {
  en,
  fr,
  es
}

export type { locales }
export { messages, LOCALES }
