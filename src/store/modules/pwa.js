const state = {
  updateSnackbar: false,
  installSnackbar: false,
  installPromptEvent: null,
  dontPromptInstall: window.localStorage.getItem('dont_prompt_install') || false
}

const getters = {
  updateSnackbar (state) {
    return state.updateSnackbar
  },
  installSnackbar (state) {
    return state.installSnackbar && !state.dontPromptInstall
  },
  installPromptEvent (state) {
    return state.installPromptEvent
  }
}

const mutations = {
  toggleUpdateSnackbar (state) {
    state.updateSnackbar = !state.updateSnackbar
  },
  toggleInstallSnackbar (state) {
    state.installSnackbar = !state.installSnackbar
  },
  installPromptEvent (state, event) {
    state.installPromptEvent = event
  }
}

const actions = {
  toggleUpdateSnackbar ({ commit }) {
    commit('toggleUpdateSnackbar')
  },
  toggleInstallSnackbar ({ commit }) {
    commit('toggleInstallSnackbar')
  },
  installPromptEvent ({ commit }, event) {
    commit('installPromptEvent', event)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
