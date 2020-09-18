import moment from 'moment'
import i18n from '../i18n'

function round5(x) {
  return Math.ceil(x / 5) * 5
}

function timingAsText(timing, now) {
  const lower = moment.parseZone(timing.range[0])

  if (timing.fast) {

    const diffMinutes = lower.diff(now, 'minutes')

    let diffRounded = round5(diffMinutes)
    if (diffRounded <= 5) {
      diffRounded = 25
    }

    return i18n.t('TIME_DIFF_SHORT', { min: diffRounded, max: (diffRounded + 5) })
  }

  return lower.calendar(now)
}

export function isFast(restaurant) {

  if (restaurant.timing.delivery) {
    return restaurant.timing.delivery.fast
  }

  if (restaurant.timing.collection) {
    return restaurant.timing.collection.fast
  }

  return false
}

export function getNextShippingTimeAsText(restaurant, now) {

  now = now || moment()

  if (restaurant.timing.delivery) {

    return timingAsText(restaurant.timing.delivery, now)
  }

  if (restaurant.timing.collection) {

    return timingAsText(restaurant.timing.collection, now)
  }

  return ''
}

export function getRestaurantCaption(restaurant) {
  return restaurant.description || restaurant.address.streetAddress
}
