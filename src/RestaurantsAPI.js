import _ from 'underscore';

class RestaurantsAPI {
  static getRestaurant(id) {
    return fetch('http://coursiers.dev' + id)
      .then((response) => {
        return response.json();
      });
  }
}

module.exports = RestaurantsAPI;