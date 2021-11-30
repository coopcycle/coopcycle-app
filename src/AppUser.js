import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

class AppUser {

  constructor(username, email, token, roles, refreshToken, enabled = true, guest = false) {
    this.username = username;
    this.email = email;
    this.token = token;
    this.roles = roles || [];
    this.refreshToken = refreshToken;
    this.enabled = enabled;
    this.guest = guest;
  }

  save() {
    console.log('Saving user in AsyncStorage...');
    return new Promise((resolve, reject) => {
      var credentials = {
        username: this.username,
        email: this.email,
        token: this.token,
        roles: this.roles,
        refresh_token: this.refreshToken,
        enabled: this.enabled,
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

  logout() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.removeItem('@User')
          .then(error => {
            if (error) {
              return reject(error);
            }

            Object.assign(this, {
              username: null,
              email: null,
              token: null,
              roles: [],
              refreshToken: null,
              enabled: true,
            })
            resolve()
          })
      } catch (error) {
        reject(error.messagee)
      }
    })
  }

  hasRole(role) {
    return _.includes(this.roles, role);
  }

  isAuthenticated() {
    return this.username && this.token;
  }

  isGuest() {
    return this.guest;
  }

  static load() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@User')
          .then((data, error) => {
            if (error) {
              return reject(error);
            }

            const credentials = data ? JSON.parse(data) : {};

            const enabled =
              credentials.hasOwnProperty('enabled') ? credentials.enabled : true
            const email =
              credentials.hasOwnProperty('email') ? credentials.email : credentials.username

            const user = new AppUser(
              credentials.username || null,
              email,
              credentials.token || null,
              credentials.roles || null,
              credentials.refresh_token || null,
              enabled
            );

            return resolve(user);
          });
      } catch (error) {
        reject(error.message);
      }
    });
  }

}

export default AppUser;
