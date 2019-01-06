import Authenticator from '@/services/Authenticator'
import axios from 'axios'

const auth = new Authenticator()
const localStorage = window.localStorage
const state = {
  authenticated: !!localStorage.getItem('access_token'),
  accessToken: localStorage.getItem('access_token'),
  idToken: localStorage.getItem('id_token'),
  expiresAt: localStorage.getItem('expires_at'),
  tokenRenewalTimeoutId: null,
  userProfile: localStorage.getItem('user_profile')
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
  },
  profileImgSource (state) {
    if (state.userProfile) {
      return state.userProfile.picture
    } else {
      return null
    }
  }
}

const mutations = {
  authenticated (state, authData) {
    state.authenticated = true
    state.accessToken = authData.accessToken
    state.idToken = authData.idToken
    state.userProfile = authData.idTokenPayload
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
    state.userProfile = null

    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user_profile')
  },

  tokenRenewalTimeoutId (state, id) {
    state.tokenRenewalTimeoutId = id
  },

  userProfile (state, userProfile) {
    state.userProfile = userProfile
    localStorage.setItem('user_profile', state.userProfile)
  }
}

const actions = {
  login () {
    auth.login()
  },

  logout ({ commit }) {
    commit('logout')
  },

  fullLogout ({ commit }) {
    commit('logout')
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
      dispatch('refreshProfile')
    } catch (error) {
      console.log(error)
      commit('logout')
    }
  },

  async refreshProfile ({ commit, state }) {
    try {
      const userProfile = await auth.getUserInfo(state.accessToken)
      commit('userProfile', userProfile)
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
