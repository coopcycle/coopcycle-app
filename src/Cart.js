import _ from 'lodash';
import moment from 'moment'

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
  toJSON() {
    return {
      product: this.menuItem['identifier'],
      quantity: this.quantity
    }
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
    return new Cart(this.restaurant, this.items.slice());
  }
  toJSON() {
    return {
      restaurant: this.restaurant['@id'],
      shippingAddress: this.deliveryAddress['@id'],
      shippedAt: moment(this.deliveryDate).format('YYYY-MM-DD HH:mm:ss'),
      items: _.map(this.items, item => item.toJSON())
    }
  }
}

module.exports = Cart;
module.exports.formatPrice = (price) => {
  return (price / 100).toFixed(2)
}
