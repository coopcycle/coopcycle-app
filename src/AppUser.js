import {
  AsyncStorage,
} from 'react-native';

import _ from 'underscore';

class AppUser {

  constructor(username, token, roles, refreshToken) {
    this.username = username;
    this.token = token;
    this.roles = roles || [];
    this.refreshToken = refreshToken;
    this.listeners = [];
  }

  save() {
    console.log('Saving user in AsyncStorage...');
    return new Promise((resolve, reject) => {
      var credentials = {
        username: this.username,
        token: this.token,
        roles: this.roles,
        refresh_token: this.refreshToken,
      }
      try {
        AsyncStorage.setItem('@User', JSON.stringify(credentials)).then((error) => {
          if (error) {
            return reject(error);
          }
          resolve(this);
        });
      } catch (error) {
        reject(error.message);
      }
    });
  }

  hasRole(role) {
    return _.contains(this.roles, role);
  }

  isAuthenticated() {

  }

  hasCredentials() {
    return this.token !== null;
  }

  addRefreshTokenErrorListener(listener) {
    this.listeners.push(listener);
  }

  onRefreshTokenError() {
    console.log('onRefreshTokenError')
    this.listeners.forEach((listener) => {
      listener.apply(null, [this]);
    });
  }

  static load() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@User')
          .then((data, error) => {
            if (error) {
              return reject(error);
            }

            var credentials = data ? JSON.parse(data) : {};

            var user = new AppUser(
              credentials.username || null,
              credentials.token || null,
              credentials.roles || null,
              credentials.refresh_token || null
            );

            return resolve(user);
          });
      } catch (error) {
        reject(error.message);
      }
    });
  }

}

module.exports = AppUser;