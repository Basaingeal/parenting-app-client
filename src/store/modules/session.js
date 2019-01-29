import Authenticator from '@/services/Authenticator'

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

  logout (state) {
    state.accessToken = null
    state.idToken = false
    clearInterval(state.tokenRenewalTimeoutId)
    state.tokenRenewalTimeoutId = null
    state.userProfile = null

    localStorage.removeItem('expires_at')
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
