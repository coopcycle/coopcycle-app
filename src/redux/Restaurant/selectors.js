import { createSelector } from 'reselect';
import { find } from 'lodash';
import moment from 'moment';
import _ from 'lodash';
import { matchesDate } from '../../utils/order';

export const selectRestaurant = state => state.restaurant.restaurant;
export const selectDate = state => state.restaurant.date;

const _selectOrders = state => state.restaurant.orders;

export const selectSpecialOpeningHoursSpecificationForToday = createSelector(
  selectRestaurant,
  selectDate,
  (restaurant, date) => {
    if (!Array.isArray(restaurant?.specialOpeningHoursSpecification)) {
      return null;
    }

    return find(
      restaurant.specialOpeningHoursSpecification,
      openingHoursSpecification => {
        return date.isSame(
          moment(openingHoursSpecification.validFrom, 'YYYY-MM-DD'),
          'day',
        );
      },
    );
  },
);

export const selectSpecialOpeningHoursSpecification = createSelector(
  selectRestaurant,
  restaurant => {
    if (restaurant) {
      return restaurant.specialOpeningHoursSpecification;
    }

    return [];
  },
);

export const selectNewOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(orders, o => matchesDate(o, date) && o.state === 'new'),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectAcceptedOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(orders, o => matchesDate(o, date) && o.state === 'accepted'),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectStartedOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(orders, o => matchesDate(o, date) && o.state === 'started'),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectReadyOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o => matchesDate(o, date) && o.state === 'ready' && !o.assignedTo,
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectPickedOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o => matchesDate(o, date) && o.state === 'ready' && !!o.assignedTo,
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectCancelledOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o =>
          matchesDate(o, date) &&
          (o.state === 'refused' || o.state === 'cancelled'),
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectFulfilledOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.filter(orders, o => matchesDate(o, date) && o.state === 'fulfilled'),
);
