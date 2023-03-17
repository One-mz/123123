import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
// import vantEnLocale from 'vant-ui/lib/locale/lang/en' // vant-ui lang
// import vantZhLocale from 'vant-ui/lib/locale/lang/zh-CN'// vant-ui lang
// import vantTWLocale from 'vant-ui/lib/locale/lang/zh-TW'// vant-ui lang
import vantEnLocale from 'vant/es/locale/lang/en-US';
import vantZhLocale from 'vant/es/locale/lang/zh-CN';
import vantTWLocale from 'vant/es/locale/lang/zh-TW';
import enLocale from './en.json'
import zhLocale from './zh-CN.json'
import twLocale from './zh-TW.json'
import { Locale } from 'vant';

Vue.use(VueI18n)

const messages = {
 
  'zh-CN': {
    ...zhLocale,
    ...vantZhLocale
  },
  'zh-TW': {
    ...twLocale,
    ...vantTWLocale
  },
  en: {
    ...enLocale,
    ...vantEnLocale
  },
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  // 默认中文简体
  // return 'zh-CN'
  return 'zh-CN'
}

const CURRENT_LANG = getLanguage()

Locale.use(CURRENT_LANG,messages[CURRENT_LANG])

const i18n = new VueI18n({
  // set locale
  // options: en | zh | tw
  locale: CURRENT_LANG,
  // set locale messages
  messages
})

export default i18n
