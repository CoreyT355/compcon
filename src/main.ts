/* eslint-disable @typescript-eslint/camelcase */
import '@mdi/font/css/materialdesignicons.css'
import 'typeface-roboto/index.css'
import 'material-icons/iconfont/material-icons.css'
import './assets/css/global.css'
import './ui/style/_style.css'
import './assets/glyphs/glyphs.css'
import './ui/globals'

import Vue from 'vue'

import App from './App.vue'
import router from './router'
import { store } from './store'
import 'vuetify/dist/vuetify.min.css'
import Vuetify from 'vuetify/lib'
import VueMousetrap from 'vue-mousetrap'
import lancerData from 'lancer-data'
import VueResizeText from 'vue-resize-text'

import './registerServiceWorker'

import theme from './ui/theme'
import themes from '@/ui/style/themes'

import mixins from './mixins'

import _ from 'lodash'
import Startup from './io/Startup'

import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'

Amplify.configure(aws_exports)

Object.defineProperty(Vue.prototype, '$_', { value: _ })

Vue.prototype.$appVersion = process.env.VERSION_STRING
Vue.prototype.$lancerVersion = `${lancerData.info.version}`

// Preload theme
const ls = JSON.parse(localStorage.getItem('user.config'))
let activeTheme = null

if (ls && ls.theme) {
  activeTheme = themes[ls.theme]
}

if (!activeTheme) {
  console.log(`there's no active theme`)
  activeTheme = themes.gms
}

theme.theme.dark = activeTheme.type === 'dark'
theme.dark = activeTheme.type === 'dark'

theme.theme.themes.dark = activeTheme.colors
theme.theme.themes.light = activeTheme.colors

const vuetify = new Vuetify(theme)

Vue.use(Vuetify)
Vue.use(VueMousetrap)
Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'md',
})
Vue.use(VueResizeText)
// Vue.use(Amplify)

Vue.config.devtools = process.env.NODE_ENV === 'development'

mixins.forEach(m => {
  Vue.mixin(m)
})

Vue.config.errorHandler = (error, vm) => {
  console.error(error)
  Vue.prototype.$notifyError(error, vm)
}
window.onerror = error => {
  console.error(error)
  Vue.prototype.$notifyError(error)
}

new Vue({
  components: { App },
  vuetify,
  router,
  store,
  async created() {
    await Startup(Vue.prototype.$appVersion, Vue.prototype.$lancerVersion, store)
  },
  render: h => h(App),
}).$mount('#app')
