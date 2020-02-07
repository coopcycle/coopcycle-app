import { createSelector } from 'reselect'
import _ from 'lodash'

export const selectDeliveryTotal = createSelector(
  state => state.checkout.cart,
  (cart) => {

    if (!cart || !cart.adjustments) {
      return 0
    }

    if (!cart.adjustments.hasOwnProperty('delivery')) {
      return 0
    }

    return _.reduce(cart.adjustments.delivery, function(total, adj) {
      return total + adj.amount
    }, 0)
  }
)

export const selectShippingDate = createSelector(
  state => state.checkout.cart,
  state => state.checkout.timing,
  (cart, timing) => {
    return cart.shippedAt ? cart.shippedAt : timing.asap
  }
)

export const selectIsShippingAsap = createSelector(
  state => state.checkout.cart,
  (cart) => (!!cart.shippedAt) !== true
)
