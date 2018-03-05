/*
 * i18n initialisation
 *
 * Initialise the i18n instance to be used in the component hierarchy
 *
 * See https://react.i18next.com/components/i18next-instance.html
 */
import { Platform } from 'react-native'
import i18next from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import I18n from 'react-native-i18n'
import AppConfig from '../AppConfig'
import en from './locales/en.json'
import fr from './locales/fr.json'

export const localeDetector = () => I18n.locale || AppConfig.LOCALE

// https://www.i18next.com/misc/creating-own-plugins.html#languagedetector
const languageDetector = {
  type: 'languageDetector',
  detect: localeDetector,
  init: () => { },
  cacheUserLanguage: () => { }
}

i18next
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: { en, fr },
    ns: ['common'],
    defaultNS: 'common',
    debug: process.env.DEBUG
  })

export default i18next
