import _ from 'underscore';
import {
  AsyncStorage,
} from 'react-native';

const AppConfig = require('./AppConfig');
// let ResourcesAPI = require('./ResourcesAPI');

class Auth {
  static getStatus() {
    return this
      .createAuthorizedRequest('GET', '/api/me/status')
      .then((request) => {
        return fetch(request)
          .then((response) => {
            return response.json();
          })
          .then((user) => {
            return user.status;
          })
          .catch((err) => {
            console.log('ERROR', err);
          });
      });
  }
  static getCurrentOrder() {
    return this
      .createAuthorizedRequest('GET', '/api/me/order')
      .then((request) => {
        return fetch(request)
          .then((response) => {
            return response.json();
          })
          .catch((err) => {
            console.log('ERROR', err);
          });
      });
  }
  static createAuthorizedRequest(method, uri, data) {
    return new Promise((resolve, reject) => {
      this.getUser().then((user) => {

        var headers = new Headers();
        headers.append("Authorization", "Bearer " + user.token);
        headers.append("Content-Type", "application/json");

        let options = {
          method: method,
          headers: headers,
        }
        if (data) {
          options.body = JSON.stringify(data)
        }

        resolve(new Request(AppConfig.API_BASEURL + uri, options));
      });
    });
  }
  static removeUser() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.removeItem('@User').then((error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      } catch (error) {
        reject(error.messagee);
      }
    });
  }
  static getUser() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@User')
          .then((user, error) => {
            if (user && !error) {
              return resolve(JSON.parse(user));
            }
            reject(error);
          });
      } catch (error) {
        reject(error.message);
      }
    });
  }
  static storeUser(user) {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.setItem('@User', JSON.stringify(user)).then((error) => {
          if (error) {
            return reject(error);
          }
          console.log('User stored successfully');
          resolve();
        });
      } catch (error) {
        reject(error.message);
      }
    });
  }
  static login(username, password) {
    var formData  = new FormData();
    formData.append("_username", username);
    formData.append("_password", password);
    var request = new Request(AppConfig.API_BASEURL + '/api/login_check', {
      method: 'POST',
      body: formData
    });

    return new Promise((resolve, reject) => {
      fetch(request)
        .then((response) => {
          if (!response.ok) {
            response.json().then((json) => {
              reject(json);
            });
          }

          return response.json();
        }).then((json) => {
          this.storeUser(json).then(() => {
            resolve(json);
          });
        }).catch((err) => {
          reject(err);
        });
    });
  }
  static checkToken() {
    return new Promise((resolve, reject) => {
      this.createAuthorizedRequest('GET', '/api/token/check')
        .then((request) => {
          fetch(request)
            .then((response) => {
              if (!response.ok) {
                if (response.status === 401) {
                  return response.json().then((json) => reject(json.message));
                }
                return reject('Internal server error');
              }
              return response.json().then(() => resolve());
            })
            .catch((err) => {
              reject('Unexpected error');
            });
        })
    });
  }
  static refreshToken() {
    return new Promise((resolve, reject) => {
      this.getUser().then((user) => {
        return reject('Could not refresh token');
        var data = new FormData();
        data.append('refresh_token', user.refresh_token);
        var request = new Request(AppConfig.API_BASEURL + '/api/token/refresh', {
          method: 'POST',
          body: data,
        });
        fetch(request)
          .then((response) => {
            if (!response.ok) {
              return reject('Could not refresh token');
            }
            return response.json()
              .then((user) => this.storeUser(user))
              .then(() => resolve());
          });
      });
    });
  }
}

module.exports = Auth;