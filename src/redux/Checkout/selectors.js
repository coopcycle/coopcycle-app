import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'

import i18n from '../../i18n'

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

    return 'delivery'
  }
)

export const selectShippingTimeRangeLabel = createSelector(
  selectCartFulfillmentMethod,
  state => state.checkout.timing,
  state => state.checkout.cart,
  (fulfillmentMethod, timing, cart) => {

    if (_.size(timing) === 0) {
      return i18n.t('LOADING')
    }

    if (!timing.range || !Array.isArray(timing.range)) {
      return i18n.t('NOT_AVAILABLE_ATM')
    }

    if (!cart.shippingTimeRange) {

      if (timing.today && timing.fast) {
        return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME_DIFF`, { diff: timing.diff })
      }

      let fromNow = moment
        .parseZone(timing.range[0])
        .calendar(null, { sameElse: 'LLLL' }).toLowerCase()

      return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME`, { fromNow })
    }

    let fromNow = moment
      .parseZone(cart.shippingTimeRange[0])
      .calendar(null, { sameElse: 'LLLL' }).toLowerCase()

    return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME`, { fromNow })
  }
)
