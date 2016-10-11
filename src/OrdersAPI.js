import _ from 'underscore';

const GeoUtils = require('../GeoUtils');
const Auth = require('./Auth');

class OrdersAPI {
  static getOrders() {
    return fetch('http://coursiers.dev/orders')
      .then((response) => {
        return response.json();
      });
  }
  static getOrderById(id) {
    return fetch('http://coursiers.dev/orders/' + id)
      .then((response) => {
        return response.json();
      })
      .then((order) => {
        order.restaurant.geo = GeoUtils.parsePoint(order.restaurant.geo);
        return new Promise((resolve, reject) => {
          resolve(order);
        });
      });
  }
  static createOrder(cart) {
    return Auth.getToken().then((token) => {
      var headers = new Headers();
      headers.append("Authorization", "Bearer " + token);
      var request = new Request('http://coursiers.dev/api/orders', {
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