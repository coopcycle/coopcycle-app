import _ from 'underscore';

class ResourcesAPI {
  static getResource(id) {
    return fetch('http://coursiers.dev' + id)
      .then((response) => {
        return response.json();
      });
  }
}

module.exports = ResourcesAPI;