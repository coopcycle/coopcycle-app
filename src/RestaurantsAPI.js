import _ from 'underscore';

class RestaurantsAPI {

  constructor(client) {
    this.client = client;
  }

  nearby(latitude, longitude, distance) {
    return this.client.get('/api/restaurants?coordinate=' + [latitude, longitude] + '&distance=' + distance);
  }
}

module.exports = RestaurantsAPI;