import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'
import router from '../router'

const AuthService = () => ({
  accessToken: null,
  idToken: null,
  expiresAt: null,
  authenticated: this.isAuthenticated(),
  authNotifier: new EventEmitter(),
  auth0Client: new auth0.WebAuth({
    domain: 'basaingeal.auth0.com',
    clientID: 'azsRdIUydF66WsEjdQaClnrAonfBUExE',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid'
  }),
  login () {
    return this.auth0Client.authorize()
  },
  handleAuthentication () {
    this.auth0Client.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        router.replace('home')
      } else if (err) {
        router.replace('home')
        console.log(err)
        window.alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  },
  setSession (authResult) {
    this.accessToken = authResult.accessToken
    this.idToken = authResult.idToken
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    this.authNotifier.emit('authChange', { authenticated: true })

    window.localStorage.setItem('loggedIn', true)
  },
  renewSession () {
    this.auth0Client.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.log(err)
        window.alert(`Could not get a new token (${err.error}: ${err.error_description}).`)
      }
    })
  },
  logout () {
    this.accessToken = null
    this.idToken = null
    this.expiresAt = null

    this.authNotifier.emit('authChange', { authenticated: false })

    window.localStorage.removeItem('loggedIn')

    router.replace('home')
  },
  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.expiresAt && window.localStorage.getItem('loggedIn') === 'true'
  }
})

export default new AuthService()
