import _ from 'lodash';
import moment from 'moment';
import { createSelector } from '@reduxjs/toolkit';

import i18n from '../../i18n';
import Address from '../../utils/Address';
import OpeningHoursSpecification from '../../utils/OpeningHoursSpecification';
import { selectIsAuthenticated, selectUser } from '../App/selectors';

const _selectCarts = state => state.checkout.carts;

export const selectCart = createSelector(
  _selectCarts,
  state => state.checkout.restaurant,
  (carts, restaurant) => {
    if (carts.hasOwnProperty(restaurant)) {
      return carts[restaurant];
    }
    return {
      cart: null,
      restaurant: null,
      token: null,
      timing: null,
      lastShownTimeRange: null,
    };
  },
);
export const selectCartWithHours = createSelector(selectCart, cartContainer => {
  if (cartContainer.cart != null) {
    const openingHoursSpecification = new OpeningHoursSpecification();
    openingHoursSpecification.openingHours =
      cartContainer.restaurant.openingHoursSpecification;
    return {
      openingHoursSpecification,
      ...cartContainer,
    };
  }
  return {
    ...cartContainer,
    openingHoursSpecification: null,
  };
});

const selectVendorId = (state, vendorId) => vendorId;

export const selectCartByVendor = createSelector(
  _selectCarts,
  selectVendorId,
  (carts, vendor) => {
    if (carts.hasOwnProperty(vendor)) {
      return carts[vendor];
    }
    return {
      cart: null,
      restaurant: null,
      token: null,
      timing: null,
      lastShownTimeRange: null,
    };
  },
);

export const selectCarts = createSelector(_selectCarts, carts =>
  _.map(carts, (value, key) => {
    const openingHoursSpecification = new OpeningHoursSpecification();
    openingHoursSpecification.openingHours =
      value.restaurant.openingHoursSpecification;
    return {
      ...value,
      openingHoursSpecification,
    };
  }),
);

export const selectRestaurant = createSelector(
  state => state.checkout.restaurants,
  _selectCarts,
  state => state.checkout.restaurant,
  (restaurants, carts, restaurant) => {
    const restaurantsWithCarts = Object.values(carts).map(c => c.restaurant);
    return (
      _.find(_.uniqBy(restaurants.concat(restaurantsWithCarts), '@id'), {
        '@id': restaurant,
      }) ?? null
    );
  },
);

export const selectRestaurantWithHours = createSelector(
  selectRestaurant,
  selected_restaurant => {
    if (selected_restaurant === null) {
      return {
        restaurant: null,
        openingHoursSpecification: null,
      };
    }
    const openingHoursSpecification = new OpeningHoursSpecification();
    openingHoursSpecification.openingHours =
      selected_restaurant.openingHoursSpecification;
    return {
      restaurant: selected_restaurant,
      openingHoursSpecification,
    };
  },
);

export const selectDeliveryTotal = createSelector(selectCart, ({ cart }) => {
  if (!cart || !cart.adjustments) {
    return 0;
  }

  if (!cart.adjustments.hasOwnProperty('delivery')) {
    return 0;
  }

  return _.reduce(
    cart.adjustments.delivery,
    function (total, adj) {
      return total + adj.amount;
    },
    0,
  );
});

export const selectFulfillmentMethods = createSelector(
  selectRestaurant,
  restaurant => {
    if (
      restaurant &&
      restaurant.fulfillmentMethods &&
      Array.isArray(restaurant.fulfillmentMethods)
    ) {
      const enabled = _.filter(restaurant.fulfillmentMethods, fm => fm.enabled);
      return _.map(enabled, fm => fm.type);
    }

    return [];
  },
);

export const selectIsDeliveryEnabled = createSelector(
  selectFulfillmentMethods,
  fulfillmentMethods => _.includes(fulfillmentMethods, 'delivery'),
);

export const selectIsCollectionEnabled = createSelector(
  selectFulfillmentMethods,
  fulfillmentMethods => _.includes(fulfillmentMethods, 'collection'),
);

export const selectCartFulfillmentMethod = createSelector(
  selectCart,
  selectIsDeliveryEnabled,
  selectIsCollectionEnabled,
  ({ cart }, isDeliveryEnabled, isCollectionEnabled) => {
    if (!cart) {
      return 'delivery';
    }

    if (cart.fulfillmentMethod) {
      return cart.fulfillmentMethod;
    }

    if (isDeliveryEnabled && isCollectionEnabled) {
      return 'delivery';
    }

    if (isCollectionEnabled && !isDeliveryEnabled) {
      return 'collection';
    }

    return 'delivery';
  },
);

export const selectShippingTimeRangeLabel = createSelector(
  selectCartFulfillmentMethod,
  selectCart,
  (fulfillmentMethod, { cart, timing }) => {
    if (_.size(timing) === 0 || !cart) {
      return i18n.t('LOADING');
    }

    if (!timing.range || !Array.isArray(timing.range)) {
      return i18n.t('NOT_AVAILABLE_ATM');
    }

    if (cart.shippingTimeRange) {
      let fromNow = moment
        .parseZone(cart.shippingTimeRange[0])
        .calendar(null, { sameElse: 'LLLL' })
        .toLowerCase();

      return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME`, {
        fromNow,
      });
    }

    if (timing.today && timing.fast) {
      return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME_DIFF`, {
        diff: timing.diff,
      });
    }

    let fromNow = moment
      .parseZone(timing.range[0])
      .calendar(null, { sameElse: 'LLLL' })
      .toLowerCase();

    return i18n.t(`CART_${fulfillmentMethod.toUpperCase()}_TIME`, {
      fromNow,
    });
  },
);

const TIMING_DIFF_REGEX = /([0-9]+) - ([0-9]+)/;
const NEXT_YEAR = 60 * 24 * 365;

const timingToInteger = timing => {
  // FIXME
  // This hotfixes a bug on the API
  // https://github.com/coopcycle/coopcycle-web/issues/2213
  if (timing.range[0] === timing.range[1]) {
    return NEXT_YEAR;
  }

  const matches = timing.diff.match(TIMING_DIFF_REGEX);

  return parseInt(matches[1], 10);
};

export const selectRestaurants = createSelector(
  state => state.checkout.restaurants,
  restaurants =>
    _.sortBy(restaurants, [
      restaurant => {
        if (restaurant.timing.delivery) {
          return timingToInteger(restaurant.timing.delivery);
        }

        if (restaurant.timing.collection) {
          return timingToInteger(restaurant.timing.collection);
        }

        return NEXT_YEAR;
      },
    ]),
);

export const cartItemsCountBadge = createSelector(
  state => Object.keys(state.checkout.carts),
  items => items.length,
);

export const selectBillingEmail = createSelector(
  selectIsAuthenticated,
  selectUser,
  state => state.checkout.guest,
  (isAuthenticated, user, guest) => {
    if (isAuthenticated) {
      return user.email;
    }

    return guest.email;
  },
);

export const selectAddresses = createSelector(
  state => state.account.addresses,
  addresses => _.uniqWith(addresses, (o, ov) => Address.geoDiff(o, ov)),
);

export const selectAvailableRestaurants = createSelector(
  state => state.checkout.restaurants,
  restaurants => _.map(restaurants, r => r.id),
);

const _selectCartParam = (state, cart) => cart;
const _selectTokenParam = (state, cart, token) => token;

export const selectCheckoutAuthorizationHeaders = createSelector(
  selectIsAuthenticated,
  _selectCartParam,
  _selectTokenParam,
  (isAuthenticatedUser, cart, sessionToken) => {
    if (isAuthenticatedUser && cart.customer) {
      return {}; // use the user's token from the httpClient
    } else {
      return {
        Authorization: `Bearer ${sessionToken}`,
      };
    }
  },
);

// This will return the payment gateway to be used for the current cart,
// or the global payment gateway (legacy)
export const selectPaymentGateway = createSelector(
  selectCart,
  state => state.app.settings,
  ({ cart }, settings) => cart?.paymentGateway || settings.payment_gateway,
);

export const selectIsValid = state => state.checkout.isValid;

const _selectViolations = state => state.checkout.violations;
export const selectViolations = createSelector(_selectViolations, violations =>
  violations.map(v => {
    switch (v.code) {
      case 'Order::SHIPPED_AT_NOT_AVAILABLE':
        return {
          code: v.code,
          message: i18n.t('ORDER__SHIPPED_AT__NOT_AVAILABLE'),
        };
      case 'Order::SHIPPED_AT_EXPIRED':
        return {
          code: v.code,
          message: i18n.t('ORDER__SHIPPED_AT__EXPIRED'),
        };
      case 'Order::SHIPPING_TIME_RANGE_NOT_AVAILABLE':
        return {
          code: v.code,
          message: i18n.t('ORDER__SHIPPING_TIME_RANGE__NOT_AVAILABLE'),
        };
      default:
        return {
          code: v.code,
          message: v.message,
        };
    }
  }),
);

export const selectPaymentDetails = state => state.checkout.paymentDetails;

export const selectIsTimeRangeChangedModalVisible = state =>
  state.checkout.isTimeRangeChangedModalVisible;

export const selectCheckoutError = state => state.checkout.errors;
