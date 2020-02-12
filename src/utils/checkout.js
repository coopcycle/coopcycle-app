import _ from 'lodash'
import moment from 'moment'
import i18n from '../i18n'

function round5(x) {
  return Math.ceil(x / 5) * 5
}

function getNextShippingTime(restaurant, now) {
  now = now || moment()

  const first = _.first(restaurant.availabilities)

  return moment.parseZone(first)
}

export function isFast(restaurant, now) {
  now = now || moment()

  const next = getNextShippingTime(restaurant, now)

  const isSameDay = next.isSame(now, 'day')
  const diffMinutes = next.diff(now, 'minutes')

  return isSameDay && diffMinutes <= 45
}

export function getNextShippingTimeAsText(restaurant, now) {

  now = now || moment()

  const firstM = getNextShippingTime(restaurant, now)

  if (isFast(restaurant, now)) {

    const diffMinutes = firstM.diff(now, 'minutes')

    let diffRounded = round5(diffMinutes)

    if (diffRounded <= 5) {
      diffRounded = 25
    }

    return i18n.t('TIME_DIFF_SHORT', { min: diffRounded, max: (diffRounded + 5) })
  } else {
    return firstM.calendar(now)
  }

  return firstM.fromNow()
}

export function getRestaurantCaption(restaurant) {
  return restaurant.description || restaurant.address.streetAddress
}
