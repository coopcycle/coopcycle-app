/*
 * i18n initialisation
 *
 * Initialise the i18n instance to be used in the component hierarchy
 *
 * See https://react.i18next.com/components/i18next-instance.html
 */
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

// Load additional Moment.js locales
import 'moment/locale/fr'

export const localeDetector = () => {
  const lang = RNLocalize.findBestAvailableLanguage(['en', 'es', 'fr'])
  if (!lang) {

    return 'en'
  }

  return lang.languageTag
}

// https://www.i18next.com/misc/creating-own-plugins.html#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: callback => {
    callback(localeDetector())
  },
  init: () => { },
  cacheUserLanguage: () => { },
}

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: { en, es, fr },
    ns: ['common'],
    defaultNS: 'common',
    debug: process.env.DEBUG,
  })

export default i18next
