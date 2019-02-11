import Authenticator from '@/services/Authenticator'
import router from '@/router.js'

const auth = new Authenticator()
const localStorage = window.localStorage
const state = {
  idToken: null,
  expiresAt: localStorage.getItem('expires_at'),
  tokenRenewalTimeoutId: null,
  userProfile: null,
  accessToken: null
}

const getters = {
  authenticated (state) {
    return !!state.accessToken && new Date(state.expiresAt) > new Date()
  },
  timeUntilExpired (state) {
    if (!state.expiresAt) {
      return 0
    }
    return state.expiresAt - Date.now()
  },
  profileImgSource (state) {
    if (state.userProfile) {
      return state.userProfile.picture
    } else {
      return ''
    }
  },
  userProfile (state) {
    return state.userProfile
  },
  accessToken (state) {
    return state.accessToken
  }
}

const mutations = {
  authenticated (state, authData) {
    state.accessToken = authData.accessToken
    state.idToken = authData.idToken
    state.userProfile = authData.idTokenPayload
    state.expiresAt = authData.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem('expires_at', state.expiresAt)
  },

  logout (state, redirect = true) {
    state.accessToken = null
    state.idToken = false
    clearInterval(state.tokenRenewalTimeoutId)
    state.tokenRenewalTimeoutId = null
    state.userProfile = null

    localStorage.removeItem('expires_at')
    if (redirect) {
      router.push({ name: 'welcome' })
    }
  },

  tokenRenewalTimeoutId (state, id) {
    state.tokenRenewalTimeoutId = id
  },

  userProfile (state, userProfile) {
    state.userProfile = userProfile
  }
}

const actions = {
  login () {
    localStorage.setItem('has_logged_in_on_browser', true)
    auth.login()
  },

  logout ({ commit }) {
    commit('logout', true)
  },

  fullLogout ({ commit }) {
    commit('logout', false)
    commit('currentChildId', null)
    window.localStorage.removeItem('dont_prompt_install')
    auth.logout()
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
    if (delay > 5000) {
      if (state.tokenRenewalTimeoutId) {
        window.clearInterval(state.tokenRenewalTimeoutId)
      }
      const tokenRenewalTimeoutId = setTimeout(async () => {
        await dispatch('renewToken')
      }, delay - 5000)
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
      dispatch('refreshProfile')
    } catch (error) {
      console.log(error)
      commit('logout', true)
    }
  },

  async refreshProfile ({ commit, state }) {
    try {
      const userProfile = await auth.getUserInfo(state.accessToken)
      commit('userProfile', userProfile)
    } catch (error) {
      console.error(error)
      commit('logout', true)
    }
  },

  renewTokenOnVisibilityChange ({ state, dispatch }) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const expiresAtDate = new Date(state.expiresAt)
        const now = new Date()
        if (now > expiresAtDate) {
          dispatch('renewToken')
        }
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
