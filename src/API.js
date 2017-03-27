// require('es6-promise').polyfill();
// require('isomorphic-fetch');

function Client(httpBaseURL, model) {
  this.httpBaseURL = httpBaseURL;
  this.model = model;
  if (this.model) console.log(this.model.token)
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
  headers.append("Authorization", "Bearer " + this.model.token);
  headers.append("Content-Type", "application/json");

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

Client.prototype.request = function(method, uri, data) {
  console.log(method + ' ' + uri);
  var req = this.model ? this.createAuthorizedRequest(method, uri, data) : this.createRequest(method, uri, data);
  return this.fetch(req);
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

Client.prototype.fetch = function(req) {
  return new Promise((resolve, reject) => {
    fetch(req)
      .then((response) => {
        console.log(response.status);
        if (response.ok) {
          return response.json().then((data) => resolve(data));
        }
        if (response.status === 401) {
          console.log('Request is not authorized, refreshing token...');
          return refreshToken(this.httpBaseURL, this.model.refreshToken)
            .then((credentials) => {
              console.log('Storing new credentials in DB...')
              this.model.token = credentials.token;
              this.model.refreshToken = credentials.refresh_token;

              return this.model.save();
            })
            .then((model) => {
              console.log('Model saved, retrying request');
              req.headers.set('Authorization', 'Bearer ' + model.token);

              return this.fetch(req);
            })
            .catch((err) => {
              console.log('Refresh token is not valid ' + this.model.refreshToken);
              this.model.onRefreshTokenError();

              console.log('REJECT')
              reject('Invalid refresh token');
            });
        }

        response.json().then((data) => reject(data.message));
      });
  });
}

Client.prototype.login = function(username, password) {
  return login(this.httpBaseURL, username, password)
    .then((credentials) => {

      Object.assign(this.model, {
        username: username,
        token: credentials.token,
        refreshToken: credentials.refresh_token,
        roles: credentials.roles,
      });

      return this.model.save();
    });
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

        return res.json().then((json) => reject(json.message));
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

module.exports = {
  createClient: function(httpBaseURL, model) {
    return new Client(httpBaseURL, model);
  }
}