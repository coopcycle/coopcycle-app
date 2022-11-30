import moment from 'moment'
import i18n from '../i18n'
import _ from 'lodash';

// Do not use named capturing groups as it's not supported by Hermes
// https://github.com/facebook/hermes/issues/46
const DIFF_REGEXP = /^([0-9]+) - ([0-9]+)$/

function round5(x) {
  return Math.ceil(x / 5) * 5
}

function timingAsText(timing, now) {

  // FIXME
  // This hotfixes a bug on the API
  // https://github.com/coopcycle/coopcycle-web/issues/2213
  if (timing.range[0] === timing.range[1]) {
    return i18n.t('NOT_AVAILABLE_ATM')
  }

  const lower = moment.parseZone(timing.range[0])

  if (timing.fast) {

    if (timing.diff && DIFF_REGEXP.test(timing.diff)) {
      const result = DIFF_REGEXP.exec(timing.diff)

      return i18n.t('TIME_DIFF_SHORT', { min: result[1], max: result[2] })
    }

    const diffMinutes = lower.diff(now, 'minutes')

    let diffRounded = round5(diffMinutes)
    if (diffRounded <= 5) {
      diffRounded = 25
    }

    return i18n.t('TIME_DIFF_SHORT', { min: diffRounded, max: (diffRounded + 5) })
  }

  return lower.calendar(now)
}

export function getNextShippingTimeAsText(restaurant, now) {

  now = now || moment()

  if (restaurant.timing.delivery) {

    return timingAsText(restaurant.timing.delivery, now)
  }

  if (restaurant.timing.collection) {

    return timingAsText(restaurant.timing.collection, now)
  }

  return i18n.t('NOT_AVAILABLE_ATM')
}

export function getRestaurantCaption(restaurant) {
  return restaurant.description || restaurant.address.streetAddress
}

export function shouldShowPreOrder(restaurant) {
  if (restaurant.timing.delivery) {
    if (restaurant.timing.delivery.range && Array.isArray(restaurant.timing.delivery.range)) {
      const duration = moment.duration(moment(restaurant.timing.delivery.range[0]).diff(moment()));

      return duration.asHours() > 1;
    }
  }

  return false
}


export function selectFulfillmentMethods(restaurant) {

    if (restaurant && restaurant.fulfillmentMethods && Array.isArray(restaurant.fulfillmentMethods)) {
      const enabled = _.filter(restaurant.fulfillmentMethods, fm => fm.enabled)
      return _.map(enabled, fm => fm.type)
    }

    return []
  }


export function selectIsDeliveryEnabled(restaurant) {
  return _.includes(selectFulfillmentMethods(restaurant), 'delivery')
}

export function selectIsCollectionEnabled(restaurant) {
  return _.includes(selectFulfillmentMethods(restaurant), 'collection')
}

export function selectCartFulfillmentMethod(restaurant, cart) {

    const isDeliveryEnabled = selectIsDeliveryEnabled(restaurant)
    const isCollectionEnabled = selectIsCollectionEnabled(restaurant)

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

export function selectShippingTimeRangeLabel(restaurant, cart){

  const fulfillmentMethod = selectCartFulfillmentMethod(restaurant, cart)
  const timing = restaurant.timing[fulfillmentMethod]

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
