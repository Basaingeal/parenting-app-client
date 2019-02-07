import Vue from 'vue'
import Vuex from 'vuex'

import session from './modules/session'
import children from './modules/children'
import pwa from './modules/pwa'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session,
    children,
    pwa
  }
})
