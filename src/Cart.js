import _ from 'underscore';

class CartItem {
  constructor(cart, offer) {
    this.cart = cart;
    this.offer = offer;
    this.quantity = 1;
    this.deliveryAddress = null;
  }
  decrement() {
    if (this.quantity > 0) {
      this.quantity--;
    }
    if (this.quantity === 0) {
      this.cart.deleteItem(this);
    }
  }
  increment() {
    this.quantity++;
  }
  get total() {
    return this.offer.price * this.quantity;
  }
  get key() {
    return this.offer['@id'];
  }
}

class Cart {
  constructor(restaurant, items) {
    this.restaurant = restaurant;
    this.items = items || [];
  }
  addOffer(offer) {
    let item = _.find(this.items, (item) => item.offer === offer);
    if (!item) {
      item = new CartItem(this, offer);
      this.items.push(item);
    } else {
      item.increment();
    }
  }
  groupByOffer() {
    let groups = _.groupBy(this.items, (item) => {
      return item.offer['@id'];
    })
    return _.map(groups, (items, id) => {
      return {
        offer: _.first(items).offer,
        quantity: items.length
      }
    });
  }
  deleteItem(item) {
    this.items = _.without(this.items, item);
  }
  get total() {
    return _.reduce(this.items, function(memo, item) { return memo + item.total; }, 0).toFixed(2);
  }
  get articlesCount() {
    return _.reduce(this.items, function(memo, item) { return memo + item.quantity; }, 0);
  }
  clone() {
    return new Cart(this.restaurant, this.items.slice());
  }
  toJSON() {
    let json = {
      // customer: '/customers/1',
      restaurant: this.restaurant['@id'],
      orderedItem: []
    }
    json.orderedItem = _.map(this.items, (item) => {
      return {
        quantity: item.quantity,
        product: item.offer['@id']
      }
    });
    json.deliveryAddress = this.deliveryAddress['@id'];

    return json;
  }
}

module.exports = Cart;