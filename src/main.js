import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

const apolloClientOptions = {
  getAuth: (tokenName) => `Bearer ${store.getters.accessToken}`
}

new Vue({
  router,
  store,
  apolloProvider: createProvider(apolloClientOptions),
  render: h => h(App)
}).$mount('#app')
