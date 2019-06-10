import i18n from './i18n'

function Client(httpBaseURL, model) {
  this.httpBaseURL = httpBaseURL;
  this.model = model;
}

Client.prototype.getBaseURL = function() {
  return this.httpBaseURL
}

Client.prototype.getToken = function() {
  return this.model.token
}

Client.prototype.createRequest = function(method, uri, data) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");

  var options = {
    method: method,
    headers: headers,
  }
  if (data) {
    options.body = JSON.stringify(data)
  }

  return new Request(this.httpBaseURL + uri, options);
}

Client.prototype.createAuthorizedRequest = function(method, uri, data) {
  var headers = new Headers();
  headers.append("Content-Type", "application/ld+json");

  if (this.model.token) {
    headers.append("Authorization", "Bearer " + this.model.token);
  }

  var options = {
    method: method,
    headers: headers,
  }
  if (data && typeof data === 'object') {
    options.body = JSON.stringify(data)
  }
  if (data && typeof data === 'string') {
    options.body = data
  }

  return new Request(this.httpBaseURL + uri, options);
}

function doFetch(req, resolve, reject) {
  // Clone Request now in case it needs to be retried
  // Once fetched, Request.body can't be copied
  const clone = req.clone()
  fetch(req)
    .then(res => {
      if (res.ok) {
        if (res.status === 204) {
          return resolve()
        }
        // Always clone response to make sure Body can be read again
        // @see https://stackoverflow.com/questions/40497859/reread-a-response-body-from-javascripts-fetch
        res.clone().json().then(data => resolve(data))
      } else {
        if (res.status === 401) {
          console.log('Request is not authorized, refreshing token…')
          this.refreshToken()
            .then(token => {
              clone.headers.set('Authorization', `Bearer ${token}`)
              doFetch.apply(this, [ clone, resolve, reject ])
            })
            .catch(e => reject(e))
        } else {
          res.json().then(data => reject(data))
        }
      }
    })
    .catch(e => reject(e))
}

Client.prototype.request = function(method, uri, data) {
  console.log(method + ' ' + uri);
  const req = this.model ? this.createAuthorizedRequest(method, uri, data) : this.createRequest(method, uri, data);
  return new Promise((resolve, reject) => doFetch.apply(this, [ req, resolve, reject ]))
}

Client.prototype.get = function(uri, data) {
  return this.request('GET', uri, data);
}

Client.prototype.post = function(uri, data) {
  return this.request('POST', uri, data);
}

Client.prototype.put = function(uri, data) {
  return this.request('PUT', uri, data);
}

Client.prototype.delete = function(uri) {
  return this.request('DELETE', uri);
}

Client.prototype.refreshToken = function() {

  return new Promise((resolve, reject) => {
    refreshToken(this.httpBaseURL, this.model.refreshToken)
      .then(credentials => {

        console.log('Storing new credentials in DB...')
        this.model.token = credentials.token
        this.model.refreshToken = credentials.refresh_token

        return this.model.save()
      })
      .then(model => resolve(model.token))
      .catch(e => reject(e))
  })
}

Client.prototype.checkToken = function() {
  const req = this.createAuthorizedRequest('GET', '/api/token/check')
  return new Promise((resolve, reject) => {
    fetch(req)
      .then(response => {
        if (response.status === 401) {
          reject()
          return
        }
        if (response.ok) {
          resolve()
        }
      })
  })
}

Client.prototype.register = function (data) {
  return register(this.httpBaseURL, data)
    .then((credentials) => {

      const enabled =
        credentials.hasOwnProperty('enabled') ? credentials.enabled : true

      Object.assign(this.model, {
        username: data.username,
        email: data.email,
        token: credentials.token,
        refreshToken: credentials.refresh_token,
        roles: credentials.roles,
        enabled
      })

      return this.model.save()
    })
}

Client.prototype.login = function(username, password) {
  return login(this.httpBaseURL, username, password)
    .then((credentials) => {

      const enabled =
        credentials.hasOwnProperty('enabled') ? credentials.enabled : true

      Object.assign(this.model, {
        username: credentials.username,
        email: credentials.email,
        token: credentials.token,
        refreshToken: credentials.refresh_token,
        roles: credentials.roles,
        enabled
      });

      return this.model.save();
    });
}

Client.prototype.confirmRegistration = function(token) {

  var request = new Request(`${this.httpBaseURL}/api/register/confirm/${token}`, {
    method: 'GET',
  })

  return fetch(request)
    .then(res =>
      res.ok
        ? res.json()
        : Promise.reject({ status: res.status })
    )
}

var register = function(baseURL, data) {
  var formData = new FormData()
  Object.keys(data)
    .forEach(key => {
      formData.append(`_${key}`, data[key])
    })
  var request = new Request(baseURL + '/api/register', {
    method: 'POST',
    body: formData
  })

  return fetch(request)
    .then(res =>
      res.ok
        ? res.json()
        : Promise.reject({ status: res.status })
    )
}

var login = function(baseURL, username, password) {

  var formData  = new FormData();
  formData.append("_username", username);
  formData.append("_password", password);
  var request = new Request(baseURL + '/api/login_check', {
    method: 'POST',
    body: formData
  });

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(function(res) {

        if (res.ok) {
          return res.json().then((json) => resolve(json));
        }

        return res.json().then((json) => reject(json));
      });
  });
}

var refreshToken = function(baseURL, refreshToken) {
  var formData  = new FormData();
  formData.append("refresh_token", refreshToken);
  var request = new Request(baseURL + '/api/token/refresh', {
    method: 'POST',
    body: formData
  });

  return new Promise((resolve, reject) => {
    fetch(request)
      .then(function(response) {
        if (response.ok) {
          return response.json().then((credentials) => resolve(credentials));
        }

        return response.json().then((json) => reject(json.message));
      });
  });
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

    if (!server.startsWith('http://') && !server.startsWith('https://')) {
      try {
        return fetch('https://' + server, { timeout: 3000 })
          .then((response) => resolve('https://' + server))
          .catch((err) => resolve('http://' + server));
      } catch (e) {
        resolve('http://' + server)
      }
    }
    resolve(server);
  });
}

const createError = function(code) {
  if (errorMessages.hasOwnProperty(code)) {
    return {
      message: i18n.t(errorMessages[code])
    }
  }

  return {
    message: i18n.t('TRY_LATER')
  }
}

const checkServer = function(server) {
  return new Promise((resolve, reject) => {
    resolveBaseURL(server)
      .then((baseURL) => {

        console.log('Base URL is ' + baseURL)

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const req = new Request(baseURL + '/api', {
          method: 'GET',
          headers: headers,
        });

        fetch(req)
          .then((response) => {

            if (!response.ok) {

              if (response.status === 503) {
                return reject(createError(ERROR_MAINTENANCE_ON))
              }

              return reject(createError(ERROR_NOT_COMPATIBLE))
            }

            response.json()
              .then((data) => {

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

                if (data.hasOwnProperty('@context')
                &&  data.hasOwnProperty('@id')
                &&  data.hasOwnProperty('@type')) {
                  resolve(baseURL);
                } else {
                  reject(createError(ERROR_NOT_COMPATIBLE))
                }

              })
              // Could not parse JSON
              .catch((err) => reject(createError(ERROR_NOT_COMPATIBLE)))
          })
          .catch((err) => {
            reject(createError(ERROR_NETWORK_REQUEST_FAILED))
          });

      })
      .catch(err => reject(err))
  });
}

module.exports = {
  checkServer,
  createClient: (httpBaseURL, model) => {
    return new Client(httpBaseURL, model)
  },
  resolveErrorMessage: data => {
    let message = 'An error occured'
    if (data.hasOwnProperty('@context') && data['@context'] === '/api/contexts/ConstraintViolationList') {
      message = data['hydra:description']
    }
    if (data.hasOwnProperty('message')) {
      message = data.message
    }

    return message
  }
}
