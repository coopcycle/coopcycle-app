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

export const selectFulfillmentMethods = createSelector(
  state => state.checkout.restaurant,
  (restaurant) => {

    if (restaurant && restaurant.fulfillmentMethods && Array.isArray(restaurant.fulfillmentMethods)) {
      const enabled = _.filter(restaurant.fulfillmentMethods, fm => fm.enabled)
      return _.map(enabled, fm => fm.type)
    }

    return []

  }
)

export const selectIsDeliveryEnabled = createSelector(
  selectFulfillmentMethods,
  (fulfillmentMethods) => _.includes(fulfillmentMethods, 'delivery')
)

export const selectIsCollectionEnabled = createSelector(
  selectFulfillmentMethods,
  (fulfillmentMethods) => _.includes(fulfillmentMethods, 'collection')
)

export const selectCartFulfillmentMethod = createSelector(
  state => state.checkout.cart,
  selectIsDeliveryEnabled,
  selectIsCollectionEnabled,
  (cart, isDeliveryEnabled, isCollectionEnabled) => {

    if (cart.fulfillmentMethod) {
      return cart.fulfillmentMethod
    }

    if (isDeliveryEnabled && isCollectionEnabled) {
      return 'delivery'
    }

    if (isCollectionEnabled && !isDeliveryEnabled) {
      return 'collection'
    }

    return'delivery'
  }
)
