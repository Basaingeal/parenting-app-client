import { isWebPSupported } from '@/services/SupportManager'

const state = {
  currentChildId: window.localStorage.getItem('current_child_id') || null,
  canUseWebP: window.localStorage.getItem('can_use_webp') || false,
  now: new Date()
}

const getters = {
  currentChildId (state) {
    return state.currentChildId
  },
  canUseWebP (state) {
    return state.canUseWebP
  },
  now (state) {
    return state.now
  }
}

const mutations = {
  currentChildId (state, currentChildId) {
    state.currentChildId = currentChildId
    if (currentChildId) {
      window.localStorage.setItem('current_child_id', currentChildId)
    } else {
      window.localStorage.removeItem('current_child_id')
    }
  },
  canUseWebP (state, hasSupport) {
    state.canUseWebP = hasSupport
    window.localStorage.setItem('can_use_webp', hasSupport)
  },
  updateNow (state) {
    state.now = new Date()
  }
}

const actions = {
  setCurrentChild ({ commit }, childId) {
    commit('currentChildId', childId)
  },
  async checkWebPSupport ({ commit }) {
    const hasSupport = await isWebPSupported()
    commit('canUseWebP', hasSupport)
  },
  startNowTimer ({ commit }) {
    window.setInterval(() => commit('updateNow'), 1000)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
