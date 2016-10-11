import _ from 'underscore';
import {
  AsyncStorage,
} from 'react-native';

class Auth {
  static getToken() {
    return new Promise((resolve, reject) => {
      try {
        AsyncStorage.getItem('@JsonWebToken').then((token, err) => {
          if (token) {
            return resolve(token);
          }
          reject();
        });
      } catch (error) {
        reject();
      }
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
        AsyncStorage.getItem('@User').then((user, error) => {
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
    var request = new Request('http://coursiers.dev/api/login_check', {
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
}

module.exports = Auth;