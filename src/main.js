import Vue from 'vue'
import './plugins/axios'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import './services/addToHomeScreen'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import './assets/fontSizeRem.css'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

const apolloClientOptions = {
  getAuth: (tokenName) => `Bearer ${store.getters.accessToken}`
}

new Vue({
  router,
  store,
  apolloProvider: createProvider(apolloClientOptions),
  vuetify,
  render: h => h(App)
}).$mount('#app')
