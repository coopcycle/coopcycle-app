import _ from 'underscore';

class OrdersAPI {
  static getOrders() {
    return fetch('http://coursiers.dev/orders')
      .then((response) => {
        return response.json();
      });
  }
}

module.exports = OrdersAPI;