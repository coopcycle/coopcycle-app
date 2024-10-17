import { createSelector } from 'reselect';
import { find } from 'lodash';
import moment from 'moment';
import _ from 'lodash';
import { matchesDate } from '../../utils/order';
import { EVENT, STATE } from '../../domain/Order';

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

export const selectAutoAcceptOrdersEnabled = createSelector(
  selectRestaurant,
  restaurant => restaurant?.autoAcceptOrdersEnabled ?? false,
);

// Temporarily display new sections only for restaurants with auto accept orders enabled
// Later on: decide when to display these sections to other restaurants
export const selectHasStartedState = createSelector(
  selectAutoAcceptOrdersEnabled,
  autoAcceptOrdersEnabled => autoAcceptOrdersEnabled,
);

// Temporarily display new sections only for restaurants with auto accept orders enabled
// Later on: decide when to display these sections to other restaurants
export const selectHasReadyState = createSelector(
  selectAutoAcceptOrdersEnabled,
  autoAcceptOrdersEnabled => autoAcceptOrdersEnabled,
);

export const selectNewOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(orders, o => matchesDate(o, date) && o.state === STATE.NEW),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

function isOrderPicked(order) {
  return order.events.findIndex(ev => ev.type === EVENT.PICKED) !== -1;
}

export const selectAcceptedOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o =>
          matchesDate(o, date) &&
          o.state === STATE.ACCEPTED &&
          !isOrderPicked(o),
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectStartedOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.sortBy(
      _.filter(
        orders,
        o =>
          matchesDate(o, date) &&
          o.state === STATE.STARTED &&
          !isOrderPicked(o),
      ),
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
        o =>
          matchesDate(o, date) && o.state === STATE.READY && !isOrderPicked(o),
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
        o =>
          matchesDate(o, date) &&
          (o.state === STATE.ACCEPTED ||
            o.state === STATE.STARTED ||
            o.state === STATE.READY) &&
          isOrderPicked(o),
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
          (o.state === STATE.REFUSED || o.state === STATE.CANCELLED),
      ),
      [o => moment.parseZone(o.pickupExpectedAt)],
    ),
);

export const selectFulfilledOrders = createSelector(
  selectDate,
  _selectOrders,
  (date, orders) =>
    _.filter(orders, o => matchesDate(o, date) && o.state === STATE.FULFILLED),
);

export const selectPrinter = state => state.restaurant.printer;
export const selectIsPrinting = state => state.restaurant.isPrinting;
export const selectIsSunmiPrinter = state => state.restaurant.isSunmiPrinter;

export const selectIsPrinterConnected = createSelector(
  selectPrinter,
  selectIsSunmiPrinter,
  (printer, isSunmiPrinter) => Boolean(printer) || isSunmiPrinter,
);

const selectOrdersToPrint = state => state.restaurant.ordersToPrint;

export const selectAutoAcceptOrdersPrintNumberOfCopies = state =>
  state.restaurant.preferences.autoAcceptOrders.printNumberOfCopies;

const selectAutoAcceptOrdersPrintMaxFailedAttempts = state =>
  state.restaurant.preferences.autoAcceptOrders.printMaxFailedAttempts;

export const selectOrderIdsToPrint = createSelector(
  selectOrdersToPrint,
  selectAutoAcceptOrdersPrintMaxFailedAttempts,
  (ordersToPrint, printMaxFailedAttempts) => {
    const orderIdsToPrint = [];

    Object.keys(ordersToPrint).forEach(orderId => {
      const printTask = ordersToPrint[orderId];
      if (printTask.failedAttempts <= printMaxFailedAttempts) {
        orderIdsToPrint.push(orderId);
      }
    });

    return orderIdsToPrint;
  },
);

export const selectOrderIdsFailedToPrint = createSelector(
  selectOrdersToPrint,
  selectAutoAcceptOrdersPrintMaxFailedAttempts,
  (ordersToPrint, printMaxFailedAttempts) => {
    const orderIdsFailedToPrint = [];

    Object.keys(ordersToPrint).forEach(orderId => {
      const printTask = ordersToPrint[orderId];
      if (printTask.failedAttempts > printMaxFailedAttempts) {
        orderIdsFailedToPrint.push(orderId);
      }
    });

    return orderIdsFailedToPrint;
  },
);

export const selectPrintingOrderId = state => state.restaurant.printingOrderId;

const selectOrderId = (state, id) => id;

export const selectOrderById = createSelector(
  _selectOrders,
  selectOrderId,
  (orders, id) => {
    if (id) {
      return orders.find(order => order['@id'] === id);
    } else {
      return undefined;
    }
  },
);

const selectOrder = (state, order) => order;

export const selectIsActionable = createSelector(
  selectHasStartedState,
  selectHasReadyState,
  selectOrder,
  (hasStartedState, hasReadyState, order) => {
    return (
      [
        STATE.NEW,
        ...(hasStartedState ? [STATE.ACCEPTED] : []),
        ...(hasReadyState ? [STATE.STARTED] : []),
      ].includes(order.state) && !isOrderPicked(order)
    );
  },
);
