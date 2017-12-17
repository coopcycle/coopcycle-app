import _ from 'underscore';
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
    return this.menuItem['@id'] === menuItem['@id']
  }
  get total() {
    return this.menuItem.offers.price * this.quantity;
  }
  get key() {
    return this.menuItem['@id'];
  }
  get price() {
    return this.menuItem.offers.price
  }
  get name() {
    return this.menuItem.name
  }
  toJSON() {
    return {
      menuItem: this.menuItem['@id'],
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

    return (this.totalItems + this.totalDelivery).toFixed(2)
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
      orderedItem: _.map(this.items, item => item.toJSON()),
      delivery: {
        deliveryAddress: this.deliveryAddress['@id'],
        date: moment(this.deliveryDate).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}

module.exports = Cart;