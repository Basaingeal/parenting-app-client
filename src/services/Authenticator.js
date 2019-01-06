import auth0 from 'auth0-js'

export default class Authenticator {
  constructor () {
    this.auth0 = new auth0.WebAuth({
      domain: 'basaingeal.auth0.com',
      clientID: 'azsRdIUydF66WsEjdQaClnrAonfBUExE',
      redirectUri: 'http://localhost:8080/auth/logincallback',
      responseType: 'token id_token',
      scope: 'openid'
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
}
