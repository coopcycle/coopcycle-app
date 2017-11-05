import _ from 'underscore';

class CartItem {
  constructor(cart, menuItem) {
    this.cart = cart;
    this.menuItem = menuItem;
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
  matches(menuItem) {
    return this.menuItem['@id'] === menuItem['@id']
  }
  get total() {
    return this.menuItem.offers.price * this.quantity;
  }
  get key() {
    return this.menuItem['@id'];
  }
}

class Cart {
  constructor(restaurant, items) {
    this.restaurant = restaurant;
    this.items = items || [];
  }
  addMenuItem(menuItem) {
    let item = _.find(this.items, item => item.matches(menuItem))
    if (!item) {
      item = new CartItem(this, menuItem)
      this.items.push(item)
    } else {
      item.increment()
    }
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