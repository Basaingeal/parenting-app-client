import Authenticator from '@/services/Authenticator'

const auth = new Authenticator()
const localStorage = window.localStorage
const state = {
  idToken: localStorage.getItem('id_token'),
  expiresAt: localStorage.getItem('expires_at'),
  tokenRenewalTimeoutId: null,
  userProfile: JSON.parse(localStorage.getItem('user_profile')),
  accessToken: localStorage.getItem('access_token')
}

const getters = {
  authenticated (state, getters) {
    return getters.timeUntilExpired > 0
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
      return null
    }
  },
  userProfile (state) {
    return state.userProfile
  }
}

const mutations = {
  authenticated (state, authData) {
    state.accessToken = authData.accessToken
    state.idToken = authData.idToken
    state.userProfile = authData.idTokenPayload
    state.expiresAt = authData.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem('id_token', state.idToken)
    localStorage.setItem('expires_at', state.expiresAt)
    localStorage.setItem('user_profile', JSON.stringify(state.userProfile))
    localStorage.setItem('access_token', state.accessToken)
  },

  logout (state) {
    state.accessToken = null
    state.idToken = false
    clearInterval(state.tokenRenewalTimeoutId)
    state.tokenRenewalTimeoutId = null
    state.userProfile = null

    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('user_profile')
    localStorage.removeItem('access_token')
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
