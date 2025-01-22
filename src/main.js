import { createApp } from 'vue'
import VueZoomer from 'vue-zoomer'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './assets/global.css'

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(VueZoomer)
  .use(vuetify)
  .mount('#app')
