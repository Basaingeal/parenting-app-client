import Authenticator from '@/services/Authenticator'

const auth = new Authenticator()
const localStorage = window.localStorage
const state = {
  authenticated: !!localStorage.getItem('access_token'),
  accessToken: localStorage.getItem('access_token'),
  idToken: localStorage.getItem('id_token'),
  expiresAt: localStorage.getItem('expires_at'),
  tokenRenewalTimeoutId: null
}

const getters = {
  authenticated (state) {
    return state.authenticated
  },
  timeUntilExpired (state) {
    if (!state.authenticated || !state.expiresAt) {
      return 0
    }
    return state.expiresAt - Date.now()
  }
}

const mutations = {
  authenticated (state, authData) {
    state.authenticated = true
    state.accessToken = authData.accessToken
    state.idToken = authData.idToken
    state.expiresAt = authData.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem('access_token', state.accessToken)
    localStorage.setItem('id_token', state.idToken)
    localStorage.setItem('expires_at', state.expiresAt)
  },

  logout (state) {
    state.authenticated = false
    state.accessToken = null
    state.idToken = false
    clearInterval(state.tokenRenewalTimeoutId)
    state.tokenRenewalTimeoutId = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
  },

  tokenRenewalTimeoutId (state, id) {
    state.tokenRenewalTimeoutId = id
  }
}

const actions = {
  login () {
    auth.login()
  },

  logout ({ commit }) {
    commit('logout')
  },

  async handleAuthentication ({ commit, dispatch }) {
    try {
      const authResult = await auth.handleAuthentication()
      commit('authenticated', authResult)
      dispatch('scheduleRenewal')
    } catch (error) {
      console.error(error)
    }
  },

  scheduleRenewal ({ commit, state, dispatch }) {
    const expiresAt = JSON.parse(state.expiresAt)
    const delay = expiresAt - Date.now()
    if (delay > 0) {
      const tokenRenewalTimeoutId = setTimeout(async () => {
        await dispatch('renewToken')
      }, delay)
      commit('tokenRenewalTimeoutId', tokenRenewalTimeoutId)
    } else {
      dispatch('logout')
    }
  },

  async renewToken ({ commit, dispatch }) {
    try {
      console.log('Renewing token...')
      const renewalResult = await auth.renewToken()
      commit('authenticated', renewalResult)
      dispatch('scheduleRenewal')
    } catch (error) {
      console.error(error)
      commit('logout')
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
