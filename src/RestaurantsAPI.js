import _ from 'underscore';

class RestaurantsAPI {
  static getRestaurant(id) {
    return fetch('http://coursiers.dev' + id)
      .then((response) => {
        return response.json();
      });
  }
  static getNearbyRestaurants(latitude, longitude, distance) {
    return fetch('http://coursiers.dev/restaurants?coordinate=' + latitude + ',' + longitude + '&distance=' + distance)
      .then((response) => {
        return response.json();
      });
  }
}

module.exports = RestaurantsAPI;