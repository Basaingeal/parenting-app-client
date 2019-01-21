import auth0 from 'auth0-js'

export default class Authenticator {
  constructor () {
    this.domain = 'basaingeal.auth0.com'
    this.auth0 = new auth0.WebAuth({
      domain: this.domain,
      clientID: 'azsRdIUydF66WsEjdQaClnrAonfBUExE',
      redirectUri: `${window.location.protocol}//${window.location.host}/auth/logincallback`,
      responseType: 'token id_token',
      scope: 'openid profile email read:activity write:activity',
      audience: 'https://api.nursry.app'
    })
  }

  login () {
    this.auth0.authorize()
  }

  handleAuthentication () {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err)

        resolve(authResult)
      })
    })
  }

  renewToken () {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  getUserInfo (accessToken) {
    return new Promise((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  logout () {
    this.auth0.logout()
  }
}
