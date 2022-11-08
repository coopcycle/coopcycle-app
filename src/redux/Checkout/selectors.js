import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'

import i18n from '../../i18n'
import { selectIsAuthenticated, selectUser } from '../App/selectors'
import OpeningHoursSpecification from '../../utils/OpeningHoursSpecification';

export const selectCart = createSelector(
  state => state.checkout.carts,
  state => state.checkout.restaurant,
  (carts, restaurant) => {
    if (carts.hasOwnProperty(restaurant)) {
      const cartContainer = carts[restaurant]
      const openingHoursSpecification = new OpeningHoursSpecification()
      openingHoursSpecification.openingHours = cartContainer.restaurant.openingHoursSpecification
      return {
        openingHoursSpecification,
        ...cartContainer,
      }
    }
    return null
  }
)

export const selectRestaurant = createSelector(
  state => state.checkout.restaurants,
  state => state.checkout.restaurant,
  (restaurants, restaurant) => {
    const selected_restaurant = _.find(restaurants, { '@id': restaurant })
    const openingHoursSpecification = new OpeningHoursSpecification()
    openingHoursSpecification.openingHours = selected_restaurant.openingHoursSpecification
    return {
      restaurant: selected_restaurant,
      openingHoursSpecification,
    }
  }
)


export const selectDeliveryTotal = createSelector(
  selectCart,
  (cart) => {
    cart = cart?.cart

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
  selectCart,
  selectIsDeliveryEnabled,
  selectIsCollectionEnabled,
  (cart, isDeliveryEnabled, isCollectionEnabled) => {
    cart = cart?.cart

    if (!cart) {
      return 'delivery'
    }

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

    if (_.size(timing) === 0 || !cart) {
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

const TIMING_DIFF_REGEX = /([0-9]+) - ([0-9]+)/
const NEXT_YEAR = 60 * 24 * 365

const timingToInteger = (timing) => {

  // FIXME
  // This hotfixes a bug on the API
  // https://github.com/coopcycle/coopcycle-web/issues/2213
  if (timing.range[0] === timing.range[1]) {
    return NEXT_YEAR
  }

  const matches = timing.diff.match(TIMING_DIFF_REGEX)

  return parseInt(matches[1], 10)
}

export const selectRestaurants = createSelector(
  state => state.checkout.restaurants,
  restaurants => _.sortBy(restaurants, [
    restaurant => {
      if (restaurant.timing.delivery) {

        return timingToInteger(restaurant.timing.delivery)
      }

      if (restaurant.timing.collection) {

        return timingToInteger(restaurant.timing.collection)
      }

      return NEXT_YEAR
    },
  ])
)

export const cartItemsCountBadge = createSelector(
  state => Object.keys(state.checkout.carts),
  items => items.length
)

export const selectCarts = createSelector(
  state => state.checkout.carts,
  carts => _.map(carts, (value, key) => {
    const openingHoursSpecification = new OpeningHoursSpecification()
    openingHoursSpecification.openingHours = value.restaurant.openingHoursSpecification
    return {
      ...value,
      openingHoursSpecification,
    }
  })
)

export const selectBillingEmail = createSelector(
  selectIsAuthenticated,
  selectUser,
  state => state.checkout.guest,
  (isAuthenticated, user, guest) => {
    if (isAuthenticated) {
      return user.email
    }

    return guest.email
  }
)
