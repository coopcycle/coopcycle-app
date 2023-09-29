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
import cs from './locales/cs.json'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import pl from './locales/pl.json'
import pt_BR from './locales/pt_BR.json'
import pt_PT from './locales/pt_PT.json'
import eu from './locales/eu.json'
import moment from 'moment'
import { LocaleConfig } from 'react-native-calendars'

import numbro from 'numbro'
import csCZ from 'numbro/languages/cs-CZ'
import deDE from 'numbro/languages/de-DE'
import enGB from 'numbro/languages/en-GB'
import esES from 'numbro/languages/es-ES'
import frFR from 'numbro/languages/fr-FR'
import itIT from 'numbro/languages/it-IT'
import plPL from 'numbro/languages/pl-PL'
import ptBR from 'numbro/languages/pt-BR'
import ptPT from 'numbro/languages/pt-PT'

export const localeDetector = () => {
  const lang = RNLocalize.findBestLanguageTag([ 'cs', 'de', 'en', 'es', 'fr', 'it', 'pl', 'pt-BR', 'pt-PT', 'eu' ])
  if (!lang) {

    return 'en'
  }

  return lang.languageTag
}

export const localeWithTagDetector = () => {
  const lang = RNLocalize.findBestLanguageTag([ 'cs-CZ', 'de-DE', 'en-GB', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'pl-PL', 'pt-BR', 'pt-PT', 'eu-ES' ])
  if (!lang) {

    return 'en-US'
  }

  return lang.languageTag
}

const LOCALE = localeDetector()
const LOCALE_WITH_TAG = localeWithTagDetector()

// Load additional Moment.js locales
import 'moment/locale/cs'
import 'moment/locale/de'
import 'moment/locale/es'
import 'moment/locale/eu'
import 'moment/locale/fr'
import 'moment/locale/it'
import 'moment/locale/pl'
import 'moment/locale/pt-br'
import 'moment/locale/pt'

// Load Numbro locales
numbro.registerLanguage(csCZ)
numbro.registerLanguage(deDE)
numbro.registerLanguage(enGB)
numbro.registerLanguage(esES)
numbro.registerLanguage(frFR)
numbro.registerLanguage(itIT)
numbro.registerLanguage(plPL)
numbro.registerLanguage(ptBR)
numbro.registerLanguage(ptPT)

numbro.setLanguage(LOCALE_WITH_TAG)

// Make sure to call moment.locale() BEFORE creating Redux store
moment.locale(LOCALE)

// https://github.com/wix/react-native-calendars#usage
LocaleConfig.locales.en = LocaleConfig.locales['']
LocaleConfig.locales[LOCALE] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysMin(),
}

LocaleConfig.defaultLocale = LOCALE;

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
    resources: { cs, de, en, es, fr, it, pl, 'pt-BR': pt_BR, 'pt-PT': pt_PT, eu },
    ns: ['common'],
    defaultNS: 'common',
    debug: process.env.DEBUG,
    compatibilityJSON: 'v3',
  })

export default i18next
