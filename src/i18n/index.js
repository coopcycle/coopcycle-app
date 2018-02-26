/*
 * i18n initialisation
 *
 * Initialise the i18n instance to be used in the component hierarchy
 *
 * See https://react.i18next.com/components/i18next-instance.html
 */
import { Platform } from 'react-native'
import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import locale from 'react-native-locale-detector'
import AppConfig from '../AppConfig'
import en from './locales/en.json'
import fr from './locales/fr.json'

// https://www.i18next.com/misc/creating-own-plugins.html#languagedetector
const languageDetector = {
  type: 'languageDetector',
  detect: () => locale || AppConfig.LOCALE,
  init: () => { },
  cacheUserLanguage: () => { }
}

i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: { en, fr },
    ns: ['common'],
    defaultNS: 'common',
    debug: process.env.DEBUG
  })

export default i18n
