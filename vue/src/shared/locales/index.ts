import en from '@/shared/locales/en/en'
// import es from '@/shared/locales/es/es.json'
// import fr from '@/shared/locales/fr/fr.json'

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

const messages = {
  en
  //   es,
  //   fr
}

export type { locales }
export { messages, LOCALES }
