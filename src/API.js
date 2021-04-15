import i18n from './i18n'
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
import RNFetchBlob from 'rn-fetch-blob'

let subscribers = []
let errorSubscribers = []
let isRefreshingToken = false

function onTokenFetched(token) {
  subscribers.forEach(callback => callback(token))
  subscribers = []
}

function addSubscriber(callback) {
  subscribers.push(callback)
}

function addErrorSubscriber(callback) {
  errorSubscribers.push(callback)
}

function onTokenRefreshError(e) {
  errorSubscribers.forEach(callback => callback(e))
  errorSubscribers = []
}

function Client(httpBaseURL, options = {}) {
  this.httpBaseURL = httpBaseURL

  this.credentials = {
    token: options.token,
    refreshToken: options.refreshToken,
  }

  this.axios = axios.create({
    baseURL: httpBaseURL,
  })

  this.axios.defaults.timeout = 30000;

  if (options.onCredentialsUpdated) {
    this.onCredentialsUpdated = options.onCredentialsUpdated
  } else {
    this.onCredentialsUpdated = () => {}
  }

  if (options.onTokenRefreshed) {
    this.onTokenRefreshed = options.onTokenRefreshed
  } else {
    this.onTokenRefreshed = () => {}
  }

  // @see https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
  // @see https://www.techynovice.com/setting-up-JWT-token-refresh-mechanism-with-axios/
  this.axios.interceptors.response.use(
    response => response,
    error => {

      if (error.response && error.response.status === 401) {

        console.log('Request is not authorized')

        try {

          const req = error.config

          return new Promise((resolve, reject) => {

            addSubscriber(token => {
              console.log('Retrying request…')
              req.headers['Authorization'] = `Bearer ${token}`
              resolve(axios(req))
            })

            addErrorSubscriber((e) => {
              reject(e)
            })

            if (!isRefreshingToken) {

              isRefreshingToken = true

              console.log('Refreshing token via interceptor…')

              this.refreshToken()
                // Make sure to resolve/reject the Promise that was returned
                .then(token => onTokenFetched(token))
                .catch(e => onTokenRefreshError(e))
                .finally(() => {
                  isRefreshingToken = false
                })
            }
          })

        } catch (e) {
          return Promise.reject(e)
        }
      }

      return Promise.reject(error)
    }
  )
}

Client.prototype.getBaseURL = function() {
  return this.httpBaseURL
}

Client.prototype.getToken = function() {
  return this.credentials.token
}

Client.prototype.createRequest = function(method, url, data) {

  const headers = {
    'Content-Type': 'application/json',
  }

  let req = {
    method,
    url,
    headers,
  }

  if (['POST', 'PUT'].includes(method.toUpperCase()) && _.size(data) > 0) {
    req['data'] = data
  }

  return req
}

Client.prototype.createAuthorizedRequest = function(method, url, data, options = {}) {

  let headers = {
    'Content-Type': 'application/ld+json',
  }

  if (this.credentials.token) {
    headers['Authorization'] = `Bearer ${this.credentials.token}`
  }

  if (options.headers) {
    headers = {
      ...headers,
      ...options.headers,
    }
  }

  let req = {
    method,
    url,
    headers,
  }

  // Make sure the request body is not empty for POST/PUT
  if (['POST', 'PUT'].includes(method.toUpperCase()) && !data) {
    data = {}
  }

  if (data && typeof data === 'object') {
    req['data'] = JSON.stringify(data)
  }
  if (data && typeof data === 'string') {
    req['data'] = data
  }

  return req
}

Client.prototype.request = function(method, uri, data, options = {}) {

  const authorized = !(!this.credentials.token || options.anonymous)
  const req = authorized ? this.createAuthorizedRequest(method, uri, data, options) : this.createRequest(method, uri, data, options)

  console.log(`${method} ${uri}${authorized ? '' : ' (anon.)'}`);

  return this.axios.request(req);
}

Client.prototype.get = function(uri, data, options = {}) {

  return enhanceRequest(this, 'GET', uri, data, options);
}

Client.prototype.post = function(uri, data) {

  return enhanceRequest(this, 'POST', uri, data);
}

Client.prototype.put = function(uri, data, options = {}) {

  return enhanceRequest(this, 'PUT', uri, data, options);
}

Client.prototype.delete = function(uri) {

  return enhanceRequest(this, 'DELETE', uri);
}

function enhanceRequest(client, method, uri, data, options = {}) {

  return client.request(method, uri, data, options)
    .then(response => response.data)
}

Client.prototype.refreshToken = function() {

  return new Promise((resolve, reject) => {

    if (!this.credentials.refreshToken) {
      reject('No refresh token')
      return
    }

    console.log('Refreshing token…')

    refreshToken(this.httpBaseURL, this.credentials.refreshToken)
      .then(res => {

        console.log('Token refreshed successfully!')

        this.credentials.token = res.data.token
        this.credentials.refreshToken = res.data.refresh_token

        this.onTokenRefreshed(res.data.token, res.data.refresh_token)

        resolve(res.data.token)
      })
      .catch(e => reject(e))
  })
}

Client.prototype.checkToken = function() {
  const req = this.createAuthorizedRequest('GET', '/api/token/check')

  return new Promise((resolve, reject) => {

    axios(req)
      .then(response => resolve())
      .catch(error => reject())
  })
}

Client.prototype.register = function (data) {
  return register(this.httpBaseURL, data)
    .then((credentials) => {
      const user = credentialsToUser(credentials)
      this.onCredentialsUpdated(user)
      return user
    })
}

Client.prototype.confirmRegistration = function(token) {
  const req = {
    method: 'GET',
    url: `${this.httpBaseURL}/api/register/confirm/${token}`,
  }

  return new Promise((resolve, reject) => {
    axios(req)
      .then(response => resolve(response.data))
      .catch(error => {
        if (error.response) {
          reject({ status: error.response.status })
        } else {
          reject({ status: 500 })
        }
      })
  })
    .then(user => {
      this.onCredentialsUpdated(user)
      return user
    })
}

Client.prototype.login = function(username, password) {
  return login(this.httpBaseURL, username, password)
    .then(credentialsToUser)
    .then(user => {
      this.onCredentialsUpdated(user)
      return user
    })
}

Client.prototype.resetPassword = function(username) {
  const req = {
    method: 'POST',
    url: `${this.httpBaseURL}/api/resetting/send-email`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      username: username,
    }),
  }

  return new Promise((resolve, reject) => {
    axios(req)
      .then(response => resolve(response.data))
      .catch(error => {
        if (error.response) {
          reject({status: error.response.status})
        } else {
          reject({status: 500})
        }
      })
  })
}

Client.prototype.setNewPassword = function(token, password) {
  const req = {
    method: 'POST',
    url: `${this.httpBaseURL}/api/resetting/reset/${token}`,
    data: qs.stringify({
      password: password,
    }),
  }

  return new Promise((resolve, reject) => {
    axios(req)
      .then(response => resolve(response.data))
      .catch(error => {
        if (error.response) {
          reject({status: error.response.status})
        } else {
          reject({status: 500})
        }
      })
  })
    .then(credentialsToUser)
    .then(user => {
      this.onCredentialsUpdated(user)
      return user
    })
}

Client.prototype.cloneWithToken = function(token) {
  return new Client(this.getBaseURL(), { token })
}

Client.prototype.uploadFile = function(uri, base64) {

  // Remove line breaks from Base64 string
  const base64AsString = base64.replace(/(\r\n|\n|\r)/gm, '')

  const headers = {
    'Authorization' : `Bearer ${this.getToken()}`,
    'Content-Type' : 'multipart/form-data',
  }

  const body = [{
    name : 'file',
    filename: 'filename.jpg', // This is needed to work
    data: base64AsString,
  }]

  return new Promise((resolve, reject) => {

    RNFetchBlob
      .fetch('POST', `${this.getBaseURL()}${uri}`, headers, body)
      // Warning: this is not a standard fetch respone
      // @see https://github.com/joltup/rn-fetch-blob/wiki/Classes#rnfetchblobresponse
      .then(fetchBlobResponse => {

        const fetchBlobResponseInfo = fetchBlobResponse.info()

        switch (fetchBlobResponseInfo.status) {
        case 401:

          addSubscriber(token => {
            console.log('Retrying request…')
            this.uploadFile(uri, base64).then(response => resolve(response))
          })

          addErrorSubscriber((e) => {
            reject(e)
          })

          if (!isRefreshingToken) {

            isRefreshingToken = true

            console.log('Refreshing token for file upload…')

            this.refreshToken()
              // Make sure to resolve/reject the Promise that was returned
              .then(token => onTokenFetched(token))
              .catch(e => onTokenRefreshError(e))
              .finally(() => {
                isRefreshingToken = false
              })
          }

          break
        case 400:
          return reject(fetchBlobResponse.json())
        case 201:
          return resolve(fetchBlobResponse.json())
        default:
          reject()
        }

      })
      .catch(e => reject(e))
  })
}

function credentialsToUser(credentials) {

  const enabled = credentials.hasOwnProperty('enabled') ? credentials.enabled : true

  const user = {
    username: credentials.username,
    email: credentials.email,
    token: credentials.token,
    refreshToken: credentials.refresh_token,
    roles: credentials.roles,
    enabled,
  }

  return user
}

var register = function(baseURL, data) {
  const req = {
    method: 'POST',
    url: `${baseURL}/api/register`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(_.mapKeys(data, (value, key) => `_${key}`)),
  }

  return new Promise((resolve, reject) => {
    axios(req)
      .then(response => resolve(response.data))
      .catch(error => {
        if (error.response) {

          const violations = (error.response.data && error.response.data.violations) || []

          const errors = _.reduce(
            violations,
            (acc, { propertyPath, message }) => ({ ...acc, [ propertyPath.replace('data.', '') ]: message }),
            {}
          )

          reject({ status: error.response.status, errors })
        } else {
          reject({ status: 500 })
        }
      })
  })
}

var login = function(baseURL, username, password) {
  const req = {
    method: 'POST',
    url: `${baseURL}/api/login_check`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      '_username': username,
      '_password': password,
    }),
  }

  return new Promise((resolve, reject) => {
    axios(req)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          reject(error.response.data)
        } else {
          reject({ message: 'An error has occured' })
        }
      })
  })
}

var refreshToken = function(baseURL, refreshToken) {

  return axios({
    method: 'POST',
    url: `${baseURL}/api/token/refresh`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      'refresh_token': refreshToken,
    }),
  })
}

const ERROR_NETWORK_REQUEST_FAILED = 'ERROR_NETWORK_REQUEST_FAILED'
const ERROR_NOT_COMPATIBLE = 'ERROR_NOT_COMPATIBLE'
const ERROR_INVALID_HOSTNAME = 'ERROR_INVALID_HOSTNAME'
const ERROR_MAINTENANCE_ON = 'ERROR_MAINTENANCE_ON'

const errorMessages = {
  [ERROR_NETWORK_REQUEST_FAILED]: 'NET_FAILED',
  [ERROR_NOT_COMPATIBLE]: 'SERVER_INCOMPATIBLE',
  [ERROR_INVALID_HOSTNAME]: 'SERVER_INVALID',
  [ERROR_MAINTENANCE_ON]: 'SERVER_UNDER_MAINTENANCE',
}

const resolveBaseURL = function(server) {
  return new Promise((resolve, reject) => {

    if (server.trim().length === 0) {
      reject(createError(ERROR_INVALID_HOSTNAME))
      return
    }

    // There is no way to "ping" the server in JavaScript, because of same-origin policy.
    // Here, we don't really try HTTPS, and fallback to HTTP
    // Actually, the HTTP "fallback" is for development, i.e localhost for ex.
    if (!server.startsWith('http://') && !server.startsWith('https://')) {
      axios
        .head(`https://${server}/api`)
        .then(response => resolve(`https://${server}`))
        .catch(error => resolve(`http://${server}`))
    } else {
      resolve(server)
    }
  });
}

const createError = function(code) {
  if (errorMessages.hasOwnProperty(code)) {
    return {
      message: i18n.t(errorMessages[code]),
    }
  }

  return {
    message: i18n.t('TRY_LATER'),
  }
}

const checkServer = function(server) {
  return new Promise((resolve, reject) => {
    resolveBaseURL(server)
      .then((baseURL) => {

        console.log('Base URL is ' + baseURL)

        axios
          .get(`${baseURL}/api`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            // {
            //   "@context":"/api/contexts/Entrypoint",
            //   "@id":"/api",
            //   "@type":"Entrypoint",
            //   "apiUser":"/api/me",
            //   "restaurant":"/api/restaurants",
            //   "deliveryAddress":"/api/delivery_addresses",
            //   "order":"/api/orders",
            //   "orderItem":"/api/order_items",
            //   "product":"/api/products"
            // }
            if (response.data.hasOwnProperty('@context')
            &&  response.data.hasOwnProperty('@id')
            &&  response.data.hasOwnProperty('@type')) {
              resolve(baseURL);
            } else {
              reject(createError(ERROR_NOT_COMPATIBLE))
            }
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 503) {
                reject(createError(ERROR_MAINTENANCE_ON))
              } else {
                reject(createError(ERROR_NOT_COMPATIBLE))
              }
            } else if (error.request) {
              reject(createError(ERROR_NETWORK_REQUEST_FAILED))
            } else {
              // TODO Handle this case
            }
          })

      })
      .catch(err => reject(err))
  });
}

module.exports = {
  checkServer,
  createClient: (httpBaseURL, options) => {
    return new Client(httpBaseURL, options)
  },
}
