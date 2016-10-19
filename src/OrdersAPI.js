import _ from 'underscore';

const GeoUtils = require('../GeoUtils');
const Auth = require('./Auth');
const AppConfig = require('./AppConfig');

class OrdersAPI {
  static getOrders() {
    return fetch(AppConfig.API_BASEURL + '/orders')
      .then((response) => {
        return response.json();
      });
  }
  static getOrderById(id) {
    return Auth.getUser()
      .then((user) => {
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + user.token);
        var request = new Request(AppConfig.API_BASEURL + '/api/orders/' + id, {
          method: 'GET',
          headers: headers,
        });
        return fetch(request)
          .then((response) => {
            return response.json();
          })
          .then((order) => {
            order.restaurant.geo = GeoUtils.parsePoint(order.restaurant.geo);
            return new Promise((resolve, reject) => {
              resolve(order);
            });
          })
          .catch((err) => {
            console.log('ERROR', err);
          });
    });
  }
  static createOrder(cart) {
    return Auth.getUser().then((user) => {
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + user.token);
      var request = new Request(AppConfig.API_BASEURL + '/api/orders', {
        method: 'POST',
        body: JSON.stringify(cart.toJSON()),
        headers: headers,
      });
      return fetch(request)
        .then((response) => {
          return response.json();
        })
        .catch((err) => {
          console.log('ERROR', err);
        });
    });
  }
}

module.exports = OrdersAPI;