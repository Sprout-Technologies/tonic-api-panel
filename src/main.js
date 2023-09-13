import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import VueKonva from 'vue-konva'
import VueApng from 'vue-apng'

import '@/icons' // icon
import '@/permission' // permission control
import JsonViewer from 'vue-json-viewer'
Vue.use(ElementUI, { locale })
Vue.use(require('vue-moment'))
Vue.use(VueKonva)
Vue.use(VueApng)
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
