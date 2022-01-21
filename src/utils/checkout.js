import moment from 'moment'
import i18n from '../i18n'

const DIFF_REGEXP = /^(?<min>[0-9]+) - (?<max>[0-9]+)$/

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
      const { groups: { min, max } } = DIFF_REGEXP.exec(timing.diff)

      return i18n.t('TIME_DIFF_SHORT', { min, max })
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
