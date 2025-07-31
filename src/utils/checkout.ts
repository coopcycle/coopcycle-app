import moment from 'moment';
import i18n from '../i18n';
import OpeningHoursSpecification from './OpeningHoursSpecification';

// Do not use named capturing groups as it's not supported by Hermes
// https://github.com/facebook/hermes/issues/46
const DIFF_REGEXP = /^([0-9]+) - ([0-9]+)$/;

function round5(x) {
  return Math.ceil(x / 5) * 5;
}

function timingAsText(timing, now) {
  const lower = moment.parseZone(timing.range[0]);

  if (timing.fast) {
    if (timing.diff && DIFF_REGEXP.test(timing.diff)) {
      const result = DIFF_REGEXP.exec(timing.diff);

      return i18n.t('TIME_DIFF_SHORT', { min: result[1], max: result[2] });
    }

    const diffMinutes = lower.diff(now, 'minutes');

    let diffRounded = round5(diffMinutes);
    if (diffRounded <= 5) {
      diffRounded = 25;
    }

    return i18n.t('TIME_DIFF_SHORT', {
      min: diffRounded,
      max: diffRounded + 5,
    });
  }

  return lower.calendar(now);
}

export function getNextShippingTime(restaurant) {

  const timing = restaurant.timing.delivery || restaurant.timing.collection;

  if (!timing) {
    return null;
  }

  // FIXME
  // This hotfixes a bug on the API
  // https://github.com/coopcycle/coopcycle-web/issues/2213
  if (!Array.isArray(timing.range)) {
    return null;
  }
  if (timing.range[0] === timing.range[1]) {
    return null;
  }

  return timing;
}


export function getNextShippingTimeAsText(restaurant, now) {
  now = now || moment();

  const timing = getNextShippingTime(restaurant);

  if (!timing) {
    return i18n.t('NOT_AVAILABLE_ATM');
  }

  return timingAsText(timing, now);
}

export function getRestaurantCaption(restaurant) {
  return restaurant.description || restaurant.address.streetAddress;
}

/**
 * While the restaurant might be available (for ordering)
 * it might be either opened or closed at the moment
 */
export function isRestaurantOrderingAvailable(restaurant) {
  const timing = getNextShippingTime(restaurant);
  return Boolean(timing);
}

/**
 * When restaurant is closed
 * it might be either available for pre-ordering or not
 */
export function isRestaurantOpeningSoon(restaurant) {
  const openingHoursSpecification = new OpeningHoursSpecification();
  openingHoursSpecification.openingHours = restaurant.openingHoursSpecification;

  const currentTimeSlot = openingHoursSpecification.currentTimeSlot;

  return (
    currentTimeSlot.state === OpeningHoursSpecification.STATE.Closed &&
    OpeningHoursSpecification.opensSoon(currentTimeSlot.timeSlot, 60)
  );
}

/**
 * Show a pre-order button to highlight the fact that the restaurant is closed
 * If the pre-order is soon, we show a regular order button
 */
export function shouldShowPreOrder(restaurant) {
  if (!isRestaurantOrderingAvailable(restaurant)) {
    return false;
  }

  const timing = getNextShippingTime(restaurant);
  const duration = moment.duration(
    moment(timing.range[0]).diff(moment()),
  );

  return duration.asHours() > 0.75;
}
