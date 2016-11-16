import _ from 'underscore';

let AppConfig = require('./AppConfig');
let Auth = require('./Auth');

class ResourcesAPI {
  static createAuthorizedRequest(method, uri, data) {
    return new Promise((resolve, reject) => {
      Auth.getUser().then((user) => {

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
  static getResource(id) {
    return fetch(AppConfig.API_BASEURL + id)
      .then((response) => {
        return response.json();
      });
  }
}

module.exports = ResourcesAPI;