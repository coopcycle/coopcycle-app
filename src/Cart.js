import _ from 'lodash';
import moment from 'moment'

class CartItem {
  constructor(cart, menuItem, options = [], quantity = 1) {
    this.cart = cart;
    this.menuItem = menuItem;
    this.options = options;
    this.quantity = quantity;
  }
  getCart() {
    return this.cart
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
    return this.menuItem['identifier'] === menuItem['identifier']
  }
  get total() {
    return this.menuItem.offers.price * this.quantity;
  }
  get key() {
    return this.menuItem['identifier'];
  }
  get price() {
    return this.menuItem.offers.price
  }
  get name() {
    return this.menuItem.name
  }
  clone() {
    return new CartItem(this.cart, this.menuItem, this.options, this.quantity);
  }
  toJSON() {
    let payload = {
      product: this.menuItem['identifier'],
      quantity: this.quantity
    }
    if (this.options.length > 0) {
      payload = {
        ...payload,
        options: _.map(this.options, option => option.identifier)
      }
    }

    return payload
  }
}

class Cart {
  constructor(restaurant, items) {
    this.restaurant = restaurant;
    this.items = items || [];
  }
  setDeliveryAddress(deliveryAddress) {
    this.deliveryAddress = deliveryAddress
  }
  setDeliveryDate(deliveryDate) {
    this.deliveryDate = deliveryDate
  }
  addMenuItem(menuItem, options = []) {
    let item = _.find(this.items, item => item.matches(menuItem))
    if (!item) {
      item = new CartItem(this, menuItem, options)
      this.items.push(item)
    } else {
      item.increment()
    }
  }
  deleteItem(item) {
    this.items = _.without(this.items, item);
  }
  get total() {
    // Do not sum delivery price until there is at least one item
    if (this.items.length === 0) {
      return 0
    }

    return this.totalItems + this.totalDelivery
  }
  get totalItems() {
    return _.reduce(this.items, function(memo, item) { return memo + item.total; }, 0)
  }
  get totalDelivery() {
    return this.restaurant.flatDeliveryPrice
  }
  get length() {
    return _.reduce(this.items, function(memo, item) { return memo + item.quantity; }, 0);
  }
  clone() {
    return new Cart(this.restaurant, this.items.slice(0));
  }
  toJSON() {

    let payload = {
      items: _.map(this.items, item => item.toJSON())
    }

    if (this.restaurant) {
      payload = {
        ...payload,
        restaurant: this.restaurant['@id'],
      }
    }

    if (this.deliveryAddress) {
      payload = {
        ...payload,
        shippingAddress: this.deliveryAddress,
      }
    }

    if (this.deliveryDate) {
      payload = {
        ...payload,
        shippedAt: moment(this.deliveryDate).format('YYYY-MM-DD HH:mm:ss'),
      }
    }

    return payload
  }
}

module.exports = Cart;
module.exports.formatPrice = (price) => {
  return (price / 100).toFixed(2)
}
