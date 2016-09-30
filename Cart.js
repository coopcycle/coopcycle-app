import _ from 'underscore';

class CartItem {
  constructor(cart, offer) {
    this.cart = cart;
    this.offer = offer;
    this.quantity = 1;
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
}

class Cart {
  constructor() {
    this.items = [];
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
}

module.exports = Cart;