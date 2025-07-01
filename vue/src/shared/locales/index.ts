import en from '@/shared/locales/en/en'

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
  en
}

export type { locales }
export { messages, LOCALES }
