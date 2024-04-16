import _, { find } from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { matchesDate } from '../../utils/order';

const _selectDate = state => state.restaurant.date;
const _selectOrders = state => state.restaurant.orders;

export const selectSpecialOpeningHoursSpecificationForToday = createSelector(
  state => state.restaurant.restaurant,
  _selectDate,
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
  state => state.restaurant.restaurant,
  restaurant => {
    if (restaurant) {
      return restaurant.specialOpeningHoursSpecification;
    }

    return [];
  },
);

export const selectNewOrders = createSelector(
  _selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(orders, o => matchesDate(o, date) && o.state === 'new'),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectAcceptedOrders = createSelector(
  _selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o => matchesDate(o, date) && o.state === 'accepted' && !o.assignedTo,
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectPickedOrders = createSelector(
  _selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o => matchesDate(o, date) && o.state === 'accepted' && !!o.assignedTo,
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectCancelledOrders = createSelector(
  _selectDate,
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
  _selectDate,
  _selectOrders,
  (date, orders) =>
    _.filter(orders, o => matchesDate(o, date) && o.state === 'fulfilled'),
);
