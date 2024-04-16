import { CommonActions } from '@react-navigation/native';
import {
  createPaymentMethod,
  handleNextAction,
  initStripe,
} from '@stripe/stripe-react-native';
import _ from 'lodash';
import { createAction } from 'redux-actions';

import * as Sentry from '@sentry/react-native';
import i18next from 'i18next';
import Share from 'react-native-share';
import NavigationHolder from '../../NavigationHolder';
import i18n from '../../i18n';
import { isFree } from '../../utils/order';
import {
  loadAddressesSuccess,
  setNewOrder,
  updateOrderSuccess,
} from '../Account/actions';
import {
  _logoutSuccess,
  logoutRequest,
  setLoading,
  setModal,
} from '../App/actions';
import {
  selectHttpClient,
  selectIsAuthenticated,
  selectUser,
} from '../App/selectors';
import {
  selectBillingEmail,
  selectCart,
  selectCartByVendor,
  selectCartFulfillmentMethod,
  selectCartWithHours,
  selectCheckoutAuthorizationHeaders,
} from './selectors';

/*
 * Action Types
 */

export const REMOVE_ITEM = 'REMOVE_ITEM';
export const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY';

export const SET_ADDRESS = '@checkout/SET_ADDRESS';
export const SET_ADDRESS_OK = '@checkout/SET_ADDRESS_OK';
export const SET_TIMING = '@checkout/SET_TIMING';
export const SET_CART_VALIDATION = '@checkout/SET_CART_VALIDATION';
export const CLEAR = '@checkout/CLEAR';
export const RESET_RESTAURANT = '@checkout/RESET_RESTAURANT';
export const SET_RESTAURANT = '@checkout/SET_RESTAURANT';
export const SET_TOKEN = '@checkout/SET_TOKEN';
export const CLEAR_ADDRESS = '@checkout/CLEAR_ADDRESS';

export const INIT_REQUEST = '@checkout/INIT_REQUEST';
export const INIT_SUCCESS = '@checkout/INIT_SUCCESS';
export const INIT_FAILURE = '@checkout/INIT_FAILURE';
export const INIT_CART_REQUEST = '@checkout/INIT_CART_REQUEST';
export const INIT_CART_SUCCESS = '@checkout/INIT_CART_SUCCESS';
export const INIT_CART_FAILURE = '@checkout/INIT_CART_FAILURE';
export const UPDATE_CARTS = '@checkout/UPDATE_CARTS';
export const DELETE_CART_REQUEST = '@checkout/DELETE_CART_REQUEST';

export const LOAD_RESTAURANTS_REQUEST = '@checkout/LOAD_RESTAURANTS_REQUEST';
export const LOAD_RESTAURANTS_SUCCESS = '@checkout/LOAD_RESTAURANTS_SUCCESS';
export const LOAD_RESTAURANTS_FAILURE = '@checkout/LOAD_RESTAURANTS_FAILURE';

export const CHECKOUT_REQUEST = '@checkout/CHECKOUT_REQUEST';
export const CHECKOUT_SUCCESS = '@checkout/CHECKOUT_SUCCESS';
export const CHECKOUT_FAILURE = '@checkout/CHECKOUT_FAILURE';

export const SHOW_ADDRESS_MODAL = '@checkout/SHOW_ADDRESS_MODAL';
export const HIDE_ADDRESS_MODAL = '@checkout/HIDE_ADDRESS_MODAL';

export const UPDATE_CART_SUCCESS = '@checkout/UPDATE_CART_SUCCESS';

export const SET_CHECKOUT_LOADING = '@checkout/SET_CHECKOUT_LOADING';

export const ADD_ITEM_REQUEST = '@checkout/ADD_ITEM_REQUEST';
export const ADD_ITEM_REQUEST_FINISHED = '@checkout/ADD_ITEM_REQUEST_FINISHED';

export const SHOW_EXPIRED_SESSION_MODAL =
  '@checkout/SHOW_EXPIRED_SESSION_MODAL';
export const HIDE_EXPIRED_SESSION_MODAL =
  '@checkout/HIDE_EXPIRED_SESSION_MODAL';
export const SESSION_EXPIRED = '@checkout/SESSION_EXPIRED';
export const SET_ADDRESS_MODAL_HIDDEN = '@checkout/SET_ADDRESS_MODAL_HIDDEN';
export const SET_ADDRESS_MODAL_MESSAGE = '@checkout/SET_ADDRESS_MODAL_MESSAGE';

export const LOAD_PAYMENT_METHODS_REQUEST =
  '@checkout/LOAD_PAYMENT_METHODS_REQUEST';
export const LOAD_PAYMENT_METHODS_SUCCESS =
  '@checkout/LOAD_PAYMENT_METHODS_SUCCESS';
export const LOAD_PAYMENT_METHODS_FAILURE =
  '@checkout/LOAD_PAYMENT_METHODS_FAILURE';

export const LOAD_PAYMENT_DETAILS_REQUEST =
  '@checkout/LOAD_PAYMENT_DETAILS_REQUEST';
export const LOAD_PAYMENT_DETAILS_SUCCESS =
  '@checkout/LOAD_PAYMENT_DETAILS_SUCCESS';
export const LOAD_PAYMENT_DETAILS_FAILURE =
  '@checkout/LOAD_PAYMENT_DETAILS_FAILURE';

export const SEARCH_REQUEST = '@checkout/SEARCH_REQUEST';
export const SEARCH_SUCCESS = '@checkout/SEARCH_SUCCESS';
export const SEARCH_FAILURE = '@checkout/SEARCH_FAILURE';
export const CLEAR_SEARCH_RESULTS = '@checkout/CLEAR_SEARCH_RESULTS';

export const GET_RESTAURANT_REQUEST = '@checkout/GET_RESTAURANT_REQUEST';
export const GET_RESTAURANT_SUCCESS = '@checkout/GET_RESTAURANT_SUCCESS';
export const GET_RESTAURANT_FAILURE = '@checkout/GET_RESTAURANT_FAILURE';

export const LOAD_STRIPE_SAVED_PAYMENT_METHODS_REQUEST =
  '@checkout/LOAD_STRIPE_SAVED_PAYMENT_METHODS_REQUEST';
export const LOAD_STRIPE_SAVED_PAYMENT_METHODS_SUCCESS =
  '@checkout/LOAD_STRIPE_SAVED_PAYMENT_METHODS_SUCCESS';
export const LOAD_STRIPE_SAVED_PAYMENT_METHODS_FAILURE =
  '@checkout/LOAD_STRIPE_SAVED_PAYMENT_METHODS_FAILURE';

export const UPDATE_CUSTOMER_GUEST = '@checkout/UPDATE_CUSTOMER_GUEST';

export const SHOW_TIMING_MODAL = '@checkout/SHOW_TIMING_MODAL';

export const HIDE_MULTIPLE_SERVERS_IN_SAME_CITY_MODAL =
  '@checkout/HIDE_MULTIPLE_SERVERS_IN_SAME_CITY_MODAL';

export const STOP_ASKING_TO_ENABLE_REUSABLE_PACKAGING =
  '@checkout/STOP_ASKING_TO_ENABLE_REUSABLE_PACKAGING';

/*
 * Action Creators
 */

export const clear = createAction(CLEAR);
export const setAddressOK = createAction(SET_ADDRESS_OK);
export const setTiming = createAction(SET_TIMING);
export const setCartValidation = createAction(
  SET_CART_VALIDATION,
  (isValid, violations = []) => ({ isValid, violations }),
);
export const clearAddress = createAction(CLEAR_ADDRESS);

export const initRequest = createAction(INIT_REQUEST);
export const initSuccess = createAction(INIT_SUCCESS, (restaurant = null) => ({
  restaurant,
}));
export const initFailure = createAction(INIT_FAILURE);
export const initCartRequest = createAction(INIT_CART_REQUEST);
export const initCartSuccess = createAction(INIT_CART_SUCCESS);
export const initCartFailure = createAction(INIT_CART_FAILURE);
export const updateCarts = createAction(UPDATE_CARTS);
export const deleteCartRequest = createAction(DELETE_CART_REQUEST);
export const resetRestaurant = createAction(RESET_RESTAURANT);
export const setRestaurant = createAction(SET_RESTAURANT);
export const setToken = createAction(SET_TOKEN);

export const loadRestaurantsRequest = createAction(LOAD_RESTAURANTS_REQUEST);
export const loadRestaurantsSuccess = createAction(LOAD_RESTAURANTS_SUCCESS);
export const loadRestaurantsFailure = createAction(LOAD_RESTAURANTS_FAILURE);

export const checkoutRequest = createAction(CHECKOUT_REQUEST);
export const checkoutSuccess = createAction(CHECKOUT_SUCCESS);
export const checkoutFailure = createAction(CHECKOUT_FAILURE);

export const showAddressModal = createAction(SHOW_ADDRESS_MODAL);
export const hideAddressModal = createAction(HIDE_ADDRESS_MODAL);

export const updateCartSuccess = createAction(UPDATE_CART_SUCCESS);
export const updateCustomerGuest = createAction(UPDATE_CUSTOMER_GUEST);

export const setCheckoutLoading = createAction(SET_CHECKOUT_LOADING);

export const addItemRequest = createAction(ADD_ITEM_REQUEST);
export const addItemRequestFinished = createAction(ADD_ITEM_REQUEST_FINISHED);

export const removeItemRequest = createAction(REMOVE_ITEM);

export const showExpiredSessionModal = createAction(SHOW_EXPIRED_SESSION_MODAL);
export const hideExpiredSessionModal = createAction(HIDE_EXPIRED_SESSION_MODAL);

export const sessionExpired = createAction(SESSION_EXPIRED);
export const setAddressModalHidden = createAction(SET_ADDRESS_MODAL_HIDDEN);
export const setAddressModalMessage = createAction(SET_ADDRESS_MODAL_MESSAGE);

export const loadPaymentMethodsRequest = createAction(
  LOAD_PAYMENT_METHODS_REQUEST,
);
export const loadPaymentMethodsSuccess = createAction(
  LOAD_PAYMENT_METHODS_SUCCESS,
);
export const loadPaymentMethodsFailure = createAction(
  LOAD_PAYMENT_METHODS_FAILURE,
);

export const loadPaymentDetailsRequest = createAction(
  LOAD_PAYMENT_DETAILS_REQUEST,
);
export const loadPaymentDetailsSuccess = createAction(
  LOAD_PAYMENT_DETAILS_SUCCESS,
);
export const loadPaymentDetailsFailure = createAction(
  LOAD_PAYMENT_DETAILS_FAILURE,
);

export const searchRequest = createAction(SEARCH_REQUEST);
export const searchSuccess = createAction(SEARCH_SUCCESS);
export const searchFailure = createAction(SEARCH_FAILURE);
export const getRestaurantFailure = createAction(GET_RESTAURANT_FAILURE);

export const getRestaurantRequest = createAction(GET_RESTAURANT_REQUEST);
export const getRestaurantSuccess = createAction(GET_RESTAURANT_SUCCESS);
export const clearSearchResults = createAction(CLEAR_SEARCH_RESULTS);

export const loadStripeSavedPaymentMethodsRequest = createAction(
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_REQUEST,
);
export const loadStripeSavedPaymentMethodsSuccess = createAction(
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_SUCCESS,
);
export const loadStripeSavedPaymentMethodsFailure = createAction(
  LOAD_STRIPE_SAVED_PAYMENT_METHODS_FAILURE,
);

export const showTimingModal = createAction(SHOW_TIMING_MODAL);

export const hideMultipleServersInSameCityModal = createAction(
  HIDE_MULTIPLE_SERVERS_IN_SAME_CITY_MODAL,
);

export const stopAskingToEnableReusablePackaging = createAction(
  STOP_ASKING_TO_ENABLE_REUSABLE_PACKAGING,
);

function validateAddress(httpClient, cart, address) {
  if (!address.isPrecise) {
    return Promise.reject(i18n.t('ADDRESS_NOT_PRECISE_ENOUGH'));
  }

  const latitude = address.geo.latitude;
  const longitude = address.geo.longitude;

  return new Promise((resolve, reject) => {
    httpClient
      .get(`${cart.restaurant}/can-deliver/${latitude},${longitude}`, {
        anonymous: true,
      })
      .then(resolve)
      .catch(() => reject(i18n.t('CHECKOUT_ADDRESS_NOT_VALID')));
  });
}

let listeners = [];

function replaceListeners(cb) {
  listeners = [cb];
}

function addListener(cb) {
  listeners.push(cb);
}

function notifyListeners(address) {
  listeners.forEach(cb => {
    if (typeof cb === 'function') {
      cb(address);
    }
  });
  listeners = [];
}

export function addItemV2(item, quantity = 1, restaurant, options) {
  return async (dispatch, getState) => {
    const { carts, address } = getState().checkout;
    const httpClient = selectHttpClient(getState());

    const requestAddress = closureAddress => {
      if (_.has(closureAddress, '@id')) {
        return closureAddress['@id'];
      }
      return closureAddress;
    };

    dispatch(addItemRequest(item));
    if (!_.has(carts, restaurant['@id'])) {
      dispatch(initCartRequest(restaurant['@id']));
      dispatch(setToken(null));
      try {
        const response = await httpClient.post('/api/carts/session', {
          restaurant: restaurant['@id'],
          shippingAddress: requestAddress(address),
        });
        const data = {
          restaurant,
          ...response,
        };
        dispatch(initCartSuccess(data));
      } catch (e) {
        //FIXME: show an error message to the customer
        console.log('failed to init cart', e);
        dispatch(initCartFailure({ restaurant: restaurant['@id'], error: e }));
        return;
      }
    }
    const { cart, token } = selectCartByVendor(getState(), restaurant['@id']);
    dispatch(setToken(token));
    const response = await httpClient.post(
      `${cart['@id']}/items`,
      {
        product: item.identifier,
        quantity,
        options,
      },
      { headers: selectCheckoutAuthorizationHeaders(getState(), cart, token) },
    );
    dispatch(addItemRequestFinished(item));
    dispatch(updateCartSuccess(response));
  };
  // Check if address is valid ?
  // Check if cart for this restaurant isset, else init it
  // Add the item to the cart
}

// This action may be dispatched several times "recursively"
export function addItem(restaurant, item, quantity = 1, options) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;
    const { address, cart, token, isAddressOK } = getState().checkout;

    const fulfillmentMethod = selectCartFulfillmentMethod(getState());

    if (!token || cart?.restaurant !== restaurant['@id']) {
      httpClient
        .post('/api/carts/session', {
          restaurant: restaurant['@id'],
        })
        .then(res => {
          dispatch(initSuccess(res.cart, res.token, restaurant));
          dispatch(addItem(restaurant, item, quantity, options));
        });

      return;
    }

    if (fulfillmentMethod === 'delivery' && (!address || !isAddressOK)) {
      // We don't have an adress
      // Stop here an ask for address
      if (!address) {
        // When the address is set,
        // re-dispatch the same action
        replaceListeners(() =>
          dispatch(addItem(restaurant, item, quantity, options)),
        );
        dispatch(showAddressModal(i18n.t('CHECKOUT_PLEASE_ENTER_ADDRESS')));
        return;
      }

      // When isAddressOK === null,
      // it means we have an address, but it hasn't been validated yet
      if (isAddressOK === null) {
        dispatch(addItemRequest(item));

        validateAddress(httpClient, cart, address)
          // When the address is valid,
          // re-dispatch the same action
          .then(() => {
            dispatch(_setAddress(address));
            dispatch(setAddressOK(true));

            addListener(() => {
              dispatch(addItemRequestFinished(item));
              dispatch(addItem(restaurant, item, quantity, options));
            });
            dispatch(syncAddress());
          })
          .catch(reason => {
            dispatch(setAddressOK(false));
            dispatch(addItemRequestFinished(item));

            replaceListeners(() =>
              dispatch(addItem(restaurant, item, quantity, options)),
            );
            dispatch(showAddressModal(reason));
          });

        return;
      }

      dispatch(showAddressModal());
      return;
    }

    dispatch(addItemRequest(item));
    dispatch(queueAddItem(item, quantity, options));
  };
}

function queueAddItem(item, quantity = 1, options = []) {
  return {
    queue: 'ADD_ITEM',
    callback: (next, dispatch, getState) => {
      const { cart, token } = getState().checkout;
      const httpClient = selectHttpClient(getState());

      dispatch(setCheckoutLoading(true));

      httpClient
        .post(
          `${cart['@id']}/items`,
          {
            product: item.identifier,
            quantity,
            options,
          },
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        )
        .then(res => {
          dispatch(setCheckoutLoading(false));
          dispatch(addItemRequestFinished(item));
          dispatch(updateCartSuccess(res));
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false));
          dispatch(addItemRequestFinished(item));
          dispatch(sessionExpired());
        })
        .finally(next);
    },
  };
}

const fetchValidation = _.throttle((dispatch, getState, cart) => {
  const { token } = selectCartByVendor(getState(), cart.restaurant);
  const httpClient = selectHttpClient(getState());

  // No need to validate when cart is empty
  if (cart.items.length === 0) {
    return;
  }

  const doTiming = () =>
    new Promise(resolve => {
      httpClient
        .get(`${cart['@id']}/timing`, {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        })
        .then(timing => dispatch(setTiming(timing)))
        // .catch(error => dispatch(setCartValidation(false, error.violations)))
        .finally(resolve);
    });

  const doValidate = () =>
    new Promise(resolve => {
      httpClient
        .get(`${cart['@id']}/validate`, {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        })
        .then(() => dispatch(setCartValidation(true)))
        .catch(error => {
          if (error.response && error.response.status === 400) {
            dispatch(setCartValidation(false, error.response.data.violations));
          } else {
            dispatch(
              setCartValidation(false, [{ message: i18n.t('TRY_LATER') }]),
            );
          }
        })
        .finally(resolve);
    });

  dispatch(setCheckoutLoading(true));

  Promise.all([doTiming(), doValidate()]).then(() =>
    dispatch(setCheckoutLoading(false)),
  );
}, 500);

const updateItemQuantity = createAction(
  UPDATE_ITEM_QUANTITY,
  (item, quantity) => ({ item, quantity }),
);

function syncItem(item) {
  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {
      const { cart, token } = selectCartByVendor(
        getState(),
        item.vendor['@id'],
      );
      dispatch(setToken(token));
      const httpClient = selectHttpClient(getState());

      // We make sure to get item from state,
      // because it may have been updated
      const itemFromState = _.find(cart.items, it => it.id === item.id);
      if (!itemFromState) {
        next();
        return;
      }

      dispatch(setCheckoutLoading(true));

      httpClient
        // FIXME We should have the "@id" property
        .put(
          `${cart['@id']}/items/${item.id}`,
          {
            quantity: itemFromState.quantity,
          },
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        )
        .then(res => {
          dispatch(updateCartSuccess(res));
          dispatch(setCheckoutLoading(false));

          fetchValidation.cancel();
          fetchValidation(dispatch, getState, res);
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false));
          dispatch(sessionExpired());
        })
        .finally(next);
    },
  };
}

const syncItemDebounced = _.debounce(
  (dispatch, item) => dispatch(syncItem(item)),
  450,
);

export function incrementItem(item) {
  return (dispatch, getState) => {
    const quantity = item.quantity + 1;
    // Dispatch an action to "virtually" change the item quantity,
    // so that the user has a UI feedback
    dispatch(updateItemQuantity(item, quantity));
    syncItemDebounced(dispatch, item);
  };
}

export function decrementItem(item) {
  return (dispatch, getState) => {
    const quantity = item.quantity - 1;
    // Dispatch an action to "virtually" change the item quantity,
    // so that the user has a UI feedback
    dispatch(updateItemQuantity(item, quantity));
    syncItemDebounced(dispatch, item);
  };
}

function queueRemoveItem(item) {
  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {
      const { cart, token } = selectCartByVendor(
        getState(),
        item.vendor['@id'],
      );
      dispatch(setToken(token));
      const httpClient = selectHttpClient(getState());

      dispatch(setCheckoutLoading(true));

      httpClient
        // FIXME We should have the "@id" property
        .delete(`${cart['@id']}/items/${item.id}`, {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        })
        .then(res => {
          dispatch(updateCartSuccess(res));
          dispatch(setCheckoutLoading(false));

          fetchValidation.cancel();
          if (res.items.length === 0) {
            return dispatch(deleteCart(res.restaurant));
          }
          fetchValidation(dispatch, getState, res);
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false));
          dispatch(sessionExpired());
        })
        .finally(next);
    },
  };
}

export function deleteCart(restaurantID) {
  return (dispatch, getState) => {
    const { carts } = getState().checkout;

    const newCarts = _.omit(carts, restaurantID);

    dispatch(setToken(null));
    dispatch(updateCarts(newCarts));
  };
}

export function removeItem(item) {
  return (dispatch, getState) => {
    // Dispatch an action to "virtually" remove the item,
    // so that the user has a UI feedback
    dispatch(removeItemRequest(item));
    const { cart } = selectCartByVendor(getState(), item.vendor['@id']);
    const { items } = cart;
    if (items.length === 0) {
      dispatch(deleteCartRequest(item.vendor['@id']));
      NavigationHolder.goBack();
    }

    dispatch(queueRemoveItem(item));
  };
}

export function setTip(cart, tipAmount) {
  return (dispatch, getState) => {
    const { token } = selectCartByVendor(getState(), cart.restaurant);
    const httpClient = selectHttpClient(getState());

    dispatch(checkoutRequest());
    httpClient
      .put(
        `${cart['@id']}/tip`,
        { tipAmount },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(res => {
        dispatch(updateCartSuccess(res));
        dispatch(checkoutSuccess());
      })
      .catch(e => {
        dispatch(checkoutFailure(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
}

export function validate(cart) {
  return (dispatch, getState) => {
    const { shippingAddress } = cart;
    const { address } = getState().checkout;

    replaceListeners(() => {
      fetchValidation(dispatch, getState, cart);
    });

    dispatch(syncAddress(cart, shippingAddress ?? address));
  };
}

const _setAddress = createAction(SET_ADDRESS);

function syncAddress(cart, address) {
  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {
      if (!cart) {
        console.error(new Error('syncAddress: cart is undefined'));
        next();
        return;
      }

      const { token } = selectCartByVendor(getState(), cart.restaurant);
      dispatch(setToken(token));

      const httpClient = selectHttpClient(getState());

      httpClient
        .put(
          cart['@id'],
          { shippingAddress: address },
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        )
        .then(res => {
          dispatch(updateCartSuccess(res));
          dispatch(setCheckoutLoading(false));
          dispatch(hideAddressModal());
          notifyListeners(address);
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false));
          dispatch(hideAddressModal());
          dispatch(sessionExpired());
        })
        .finally(next);
    },
  };
}

export function setAddress(address, cart = null) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    if (cart?.restaurant) {
      dispatch(setCheckoutLoading(true));

      validateAddress(httpClient, cart, address)
        .then(() => {
          dispatch(_setAddress(address));
          dispatch(setAddressOK(true));
          dispatch(syncAddress(cart, address));
        })
        .catch(reason => {
          dispatch(setAddressOK(false));
          dispatch(setAddressModalMessage(reason));
          dispatch(setCheckoutLoading(false));
          dispatch(
            setModal({
              show: true,
              skippable: true,
              content: reason,
              type: 'error',
            }),
          );
        });
    } else {
      dispatch(_setAddress(address));
    }
  };
}

function wrapRestaurantsWithTiming(restaurants) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    const promises = restaurants.map(
      restaurant =>
        new Promise(resolve => {
          httpClient
            .get(restaurant['@id'] + '/timing', { anonymous: true })
            .then(res => resolve(res))
            .catch(e => resolve({ delivery: null, collection: null }));
        }),
    );

    Promise.all(promises).then(values => {
      const restaurantsWithTiming = _.map(restaurants, (restaurant, index) => ({
        ...restaurant,
        timing: values[index],
      }));
      dispatch(loadRestaurantsSuccess(restaurantsWithTiming));
    });
  };
}

function _maintenanceModeHandler(error, dispatch) {
  if (error.response?.status === 503) {
    const message = error.response?.data?.message;
    if (message) {
      dispatch(
        setModal({
          show: true,
          skippable: false,
          content: message,
        }),
      );
    }
  }
}

export function searchRestaurantsForAddress(address, options = {}) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    let queryString = `coordinate=${address.geo.latitude},${address.geo.longitude}`;
    dispatch(loadRestaurantsRequest());

    const uri =
      options && options.baseURL
        ? `${options.baseURL}/api/restaurants`
        : '/api/restaurants';

    httpClient
      .get(uri + (queryString ? `?${queryString}` : ''), { anonymous: true })
      .then(res => {
        dispatch(_setAddress(address));
        dispatch(wrapRestaurantsWithTiming(res['hydra:member']));
      })
      .catch(e => {
        dispatch(loadRestaurantsFailure(e));
        _maintenanceModeHandler(e, dispatch);
      });
  };
}

export function searchRestaurants(options = {}) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    dispatch(loadRestaurantsRequest());

    const uri =
      options && options.baseURL
        ? `${options.baseURL}/api/restaurants`
        : '/api/restaurants';

    const reqs = [httpClient.get(uri, { anonymous: true })];

    if (selectIsAuthenticated(getState())) {
      reqs.push(httpClient.get('/api/me'));
    }

    Promise.all(reqs)
      .then(values => {
        if (values.length === 2) {
          const addresses = values[1].addresses.map(address => ({
            ...address,
            isPrecise: true,
          }));
          dispatch(loadAddressesSuccess(addresses));
        }
        dispatch(wrapRestaurantsWithTiming(values[0]['hydra:member']));
      })
      .catch(e => {
        dispatch(loadRestaurantsFailure(e));
        _maintenanceModeHandler(e, dispatch);
      });
  };
}

export function mercadopagoCheckout(payment) {
  /**
   * Helper function to handle errors
   */
  function handleError(dispatch, error) {
    dispatch(checkoutFailure(error));
    // We navigate back to the MoreInfos screen. Should we navigate to another screen?
    NavigationHolder.navigate('CheckoutMoreInfos', {});
  }

  return (dispatch, getState) => {
    const { cart, token } = getState().checkout;

    const { id, status, statusDetail } = payment;

    if (status !== 'approved') {
      handleError(dispatch, { status, statusDetail });
      return;
    }

    const params = {
      paymentId: id,
      paymentMethodId: 'CARD',
    };

    const httpClient = selectHttpClient(getState());

    httpClient
      .put(cart['@id'] + '/pay', params, {
        headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
      })
      .then(order => {
        dispatch(handleSuccessNav(order));
      })
      .catch(orderUpdateError => {
        handleError(dispatch, orderUpdateError);
      });
  };
}

function handleSuccessNav(order) {
  return (dispatch, getState) => {
    const { token } = selectCartByVendor(getState(), order.restaurant['@id']);

    dispatch(setNewOrder(order, token));

    // First, reset checkout stack
    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'Main',
        params: {
          screen: 'CheckoutHome',
        },
      }),
    );

    // Then, navigate to order screen
    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'OrderTracking',
        params: { order: order.number },
      }),
    );

    dispatch(deleteCart(order.restaurant['@id']));
    dispatch(checkoutSuccess(order));
  };
}

function validateCart(cart) {
  if (!cart) {
    return false;
  }

  if (!cart.customer) {
    return false;
  }

  return true;
}

/**
 * @see https://stripe.com/docs/payments/accept-a-payment?platform=react-native&ui=custom
 * @see https://stripe.com/docs/payments/accept-a-payment-synchronously?platform=react-native
 * @see https://github.com/stripe/stripe-react-native/blob/master/example/src/screens/NoWebhookPaymentScreen.tsx
 */
export function checkout(
  cardholderName,
  savedPaymentMethodId = null,
  saveCard = false,
) {
  return (dispatch, getState) => {
    dispatch(checkoutRequest());

    const { restaurant, paymentDetails } = getState().checkout;
    const { cart, token } = selectCartByVendor(getState(), restaurant);
    const billingEmail = selectBillingEmail(getState());

    const loggedOrderId = cart['@id'];

    const httpClient = selectHttpClient(getState());

    if (!validateCart(cart)) {
      dispatch(checkoutFailure());
      NavigationHolder.dispatch(
        CommonActions.navigate({
          name: 'Cart',
        }),
      );
      dispatch(
        setModal({
          show: true,
          skippable: true,
          content: 'An error occurred, please try again later',
          type: 'error',
        }),
      );
      return;
    }

    if (isFree(cart)) {
      httpClient
        .put(
          cart['@id'] + '/pay',
          {},
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        )
        .then(o => dispatch(handleSuccessNav(o)))
        .catch(e => dispatch(checkoutFailure(e)));

      return;
    }

    getPaymentMethod(cardholderName, billingEmail, cart, savedPaymentMethodId)
      .then(paymentMethodId => {
        if (paymentDetails.stripeAccount) {
          // for connected account we have to clone the platform payment method
          return httpClient
            .get(
              `${cart['@id']}/stripe/clone-payment-method/${paymentMethodId}`,
              {
                headers: selectCheckoutAuthorizationHeaders(
                  getState(),
                  cart,
                  token,
                ),
              },
            )
            .then(clonnedPaymentMethod => {
              return [paymentMethodId, clonnedPaymentMethod.id];
            });
        } else {
          // use the platform payment method
          return [paymentMethodId];
        }
      })
      .then(([platformAccountPaymentMethodId, clonnedPaymentMethodId]) =>
        httpClient.put(
          cart['@id'] + '/pay',
          {
            paymentMethodId:
              clonnedPaymentMethodId || platformAccountPaymentMethodId,
            saveCard,
          },
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        ),
      )
      .then(stripeResponse => {
        if (stripeResponse.requiresAction) {
          configureStripe(getState(), paymentDetails)
            .then(() =>
              handleNextAction(stripeResponse.paymentIntentClientSecret),
            )
            .then(({ error, paymentIntent }) => {
              if (error) {
                throw new Error('handleNextAction error:', { cause: error });
              } else {
                dispatch(
                  handleSuccess(
                    cart,
                    token,
                    paymentIntent.id,
                    saveCard,
                    cardholderName,
                  ),
                );
              }
            })
            .catch(e => {
              const err = new Error(
                `order: ${loggedOrderId}; failed to complete action required by Stripe`,
                {
                  cause: e,
                },
              );
              console.log('stripeResponse.requiresAction', err);
              dispatch(checkoutFailure(err));
            });
        } else {
          dispatch(
            handleSuccess(
              cart,
              token,
              stripeResponse.paymentIntentId,
              saveCard,
              cardholderName,
            ),
          );
        }
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
}

function getPaymentMethod(
  cardholderName,
  billingEmail,
  cart,
  savedPaymentMethodId,
) {
  return new Promise((resolve, reject) => {
    if (savedPaymentMethodId) {
      resolve(savedPaymentMethodId);
    } else {
      return createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: billingEmail,
            name: cardholderName,
            phone:
              cart.fulfillmentMethod === 'delivery'
                ? cart.shippingAddress.telephone
                : '',
          },
        },
      }).then(({ paymentMethod, error }) => {
        if (error) {
          reject(error);
        } else {
          resolve(paymentMethod.id);
        }
      });
    }
  });
}

function configureStripe(state, paymentDetails = null) {
  let stripeProps = {
    publishableKey: state.app.settings.stripe_publishable_key,
  };

  if (paymentDetails && paymentDetails.stripeAccount) {
    stripeProps = {
      ...stripeProps,
      stripeAccountId: paymentDetails.stripeAccount,
    };
  }

  return initStripe(stripeProps);
}

function handleSuccess(
  cart,
  token,
  paymentIntentId,
  saveCard = false,
  cardholderName,
) {
  return (dispatch, getState) => {
    const loggedOrderId = cart['@id'];
    const httpClient = selectHttpClient(getState());

    handleSaveOfPaymentMethod(saveCard, cardholderName, getState)
      .catch(e => {
        // do not interrupt flow if there is an error with this
        const err = new Error(
          `order: ${loggedOrderId}; failed to save a payment method`,
          {
            cause: e,
          },
        );
        console.log('handleSaveOfPaymentMethod', err);
        Sentry.captureException(err);
      })
      .then(() => {
        httpClient
          .put(
            cart['@id'] + '/pay',
            { paymentIntentId },
            {
              headers: selectCheckoutAuthorizationHeaders(
                getState(),
                cart,
                token,
              ),
            },
          )
          .then(order => {
            dispatch(handleSuccessNav(order));
          })
          .catch(e => {
            const err = new Error(
              `order: ${loggedOrderId}; failed to mark order as paid`,
              {
                cause: e,
              },
            );
            console.log('PUT; /pay', err);
            Sentry.captureException(err);

            return dispatch(checkoutFailure(err));
          });
      });
  };
}

function handleSaveOfPaymentMethod(saveCard, cardholderName, getState) {
  return new Promise(resolve => {
    const httpClient = selectHttpClient(getState());
    const { restaurant, paymentDetails } = getState().checkout;

    if (saveCard && paymentDetails.stripeAccount) {
      const billingEmail = selectBillingEmail(getState());
      const { cart, token } = selectCartByVendor(getState(), restaurant);

      return configureStripe(getState())
        .then(() =>
          createPaymentMethod({
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                email: billingEmail,
                name: cardholderName,
                phone:
                  cart.fulfillmentMethod === 'delivery'
                    ? cart.shippingAddress.telephone
                    : '',
              },
            },
          }),
        )
        .then(({ paymentMethod, error }) => {
          if (error) {
            throw new Error(error);
          } else {
            httpClient
              .post(
                cart['@id'] + '/stripe/create-setup-intent-or-attach-pm',
                {
                  payment_method_to_save: paymentMethod.id,
                },
                {
                  headers: selectCheckoutAuthorizationHeaders(
                    getState(),
                    cart,
                    token,
                  ),
                },
              )
              .then(() => resolve());
          }
        });
    } else {
      resolve();
    }
  });
}

export function assignAllCarts() {
  return (dispatch, getState) => {
    const { carts } = getState().checkout;

    return Promise.all(
      Object.values(carts).map(({ cart, token }) =>
        dispatch(_assignCustomer(cart, token, {})),
      ),
    );
  };
}

export function assignCustomer({ email, telephone }) {
  return async (dispatch, getState) => {
    const { cart, token } = selectCart(getState());
    await dispatch(_assignCustomer(cart, token, { email, telephone }));
  };
}

function _assignCustomer(cart, token, { email, telephone }) {
  return (dispatch, getState) => {
    const user = selectUser(getState());

    if (!user.isGuest() && cart.customer) {
      return;
    }

    dispatch(checkoutRequest());

    const httpClient = selectHttpClient(getState());
    let body = {};
    let authorizationHeaders = {};

    if (user.isGuest()) {
      body = {
        guest: true,
        email,
        telephone,
      };
      authorizationHeaders = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      authorizationHeaders = {}; // use the user's token from the httpClient
    }

    return httpClient
      .put(cart['@id'] + '/assign', body, {
        headers: {
          'X-CoopCycle-Session': `Bearer ${token}`,
          ...authorizationHeaders,
        },
      })
      .then(res => {
        if (user.isGuest()) {
          dispatch(updateCustomerGuest({ email, telephone }));
        }
        if (!validateCart(res)) {
          dispatch(checkoutFailure());
          dispatch(
            setModal({
              show: true,
              skippable: true,
              content: i18next.t('SESSION_ERROR_TRY_AGAIN'),
              type: 'error',
            }),
          );
          dispatch(logoutRequest());
          user.logout().then(() => {
            dispatch(_logoutSuccess());
          });
          NavigationHolder.dispatch(
            CommonActions.navigate({
              name: 'CheckoutLogin',
            }),
          );
        } else {
          dispatch(updateCartSuccess(res));
          dispatch(checkoutSuccess());
        }
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
}

export function resetSearch(options = {}) {
  return (dispatch, getState) => {
    dispatch(_setAddress(''));
    dispatch(searchRestaurants(options));
  };
}

const doUpdateCart = (cart, token, payload, cb) => {
  return (dispatch, getState) => {
    const httpClient = selectHttpClient(getState());

    return httpClient
      .put(cart['@id'], payload, {
        headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
      })
      .then(res => {
        dispatch(updateCartSuccess(res));
        dispatch(checkoutSuccess());
        _.isFunction(cb) && cb(res);
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
};

export function updateCart(payload, cb) {
  return (dispatch, getState) => {
    const { restaurant } = getState().checkout;
    const { cart, token } = selectCartByVendor(getState(), restaurant);

    const httpClient = selectHttpClient(getState());

    if (payload.shippingAddress) {
      const shippingAddress = {
        ...cart.shippingAddress,
        ...payload.shippingAddress,
      };
      payload = {
        ...payload,
        shippingAddress,
      };
    }

    dispatch(checkoutRequest());

    // For "collection" fulfillment
    // We store the phone number at the user level
    if (payload.telephone) {
      const { telephone, ...payloadWithoutTelephone } = payload;

      httpClient
        .put(
          cart.customer,
          { telephone },
          {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          },
        )
        .then(res =>
          dispatch(doUpdateCart(cart, token, payloadWithoutTelephone, cb)),
        )
        .catch(e => dispatch(checkoutFailure(e)));
    } else {
      dispatch(doUpdateCart(cart, token, payload, cb));
    }
  };
}

// FEAT: add a way to precise id
export function setDate(shippingTimeRange, cb) {
  return (dispatch, getState) => {
    const { cart, token } = selectCartWithHours(getState());
    const httpClient = selectHttpClient(getState());

    dispatch(checkoutRequest());

    httpClient
      .put(
        cart['@id'],
        {
          shippingTimeRange,
        },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(res => {
        dispatch(updateCartSuccess(res));
        setTimeout(() => {
          dispatch(checkoutSuccess());
          _.isFunction(cb) && cb();
        }, 250);
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
}

export function setDateAsap(cart, cb) {
  return (dispatch, getState) => {
    const { token } = selectCartByVendor(getState(), cart.restaurant);
    const httpClient = selectHttpClient(getState());

    dispatch(checkoutRequest());

    httpClient
      .put(
        cart['@id'],
        {
          shippingTimeRange: null,
        },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(res => {
        dispatch(updateCartSuccess(res));
        setTimeout(() => {
          dispatch(checkoutSuccess());
          _.isFunction(cb) && cb();
        }, 250);
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
}

export function setFulfillmentMethod(method) {
  return (dispatch, getState) => {
    const { address } = getState().checkout;
    const { cart, token } = selectCartWithHours(getState());

    //dispatch(checkoutRequest())
    dispatch(setToken(token));

    const httpClient = selectHttpClient(getState());

    httpClient
      .put(
        cart['@id'],
        {
          fulfillmentMethod: method,
        },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(res => {
        httpClient
          .get(`${cart['@id']}/timing`, {
            headers: selectCheckoutAuthorizationHeaders(
              getState(),
              cart,
              token,
            ),
          })
          .then(timing => {
            dispatch(setCheckoutLoading(false));
            dispatch(setTiming(timing));
            dispatch(updateCartSuccess(res));

            if (method === 'delivery') {
              if (!cart.shippingAddress) {
                if (!address) {
                  dispatch(
                    showAddressModal(i18n.t('CHECKOUT_PLEASE_ENTER_ADDRESS')),
                  );
                } else {
                  dispatch(
                    updateCartSuccess({
                      ...res,
                      shippingAddress: address,
                    }),
                  );
                }
              }
            } else {
              dispatch(hideAddressModal());
              notifyListeners();
            }
          })
          .catch(e => dispatch(checkoutFailure(e)));
      })
      .catch(e => {
        dispatch(setCheckoutLoading(false));
      });
  };
}

export function loadPaymentMethods(method) {
  return (dispatch, getState) => {
    const { cart, token } = selectCartWithHours(getState());

    const httpClient = selectHttpClient(getState());

    dispatch(loadPaymentMethodsRequest());

    httpClient
      .get(`${cart['@id']}/payment_methods`, {
        headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
      })
      .then(res => dispatch(loadPaymentMethodsSuccess(res)))
      .catch(e => dispatch(loadPaymentMethodsFailure(e)));
  };
}

export function checkoutWithCash() {
  return (dispatch, getState) => {
    const { cart, token } = selectCartWithHours(getState());
    const httpClient = selectHttpClient(getState());

    dispatch(checkoutRequest());

    httpClient
      .put(
        cart['@id'] + '/pay',
        { cashOnDelivery: true },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(order => dispatch(handleSuccessNav(order)))
      .catch(e => dispatch(checkoutFailure(e)));
  };
}

export function loadPaymentDetails() {
  return (dispatch, getState) => {
    const { cart, token } = selectCartWithHours(getState());
    const httpClient = selectHttpClient(getState());

    dispatch(loadPaymentDetailsRequest());

    httpClient
      .get(`${cart['@id']}/payment`, {
        headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
      })
      .then(res => dispatch(loadPaymentDetailsSuccess(res)))
      .catch(e => dispatch(loadPaymentDetailsFailure(e)));
  };
}

export function loadStripeSavedPaymentMethods() {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    dispatch(loadStripeSavedPaymentMethodsRequest());

    httpClient
      .get('/api/me/stripe-payment-methods')
      .then(res => dispatch(loadStripeSavedPaymentMethodsSuccess(res)))
      .catch(e => dispatch(loadStripeSavedPaymentMethodsFailure(e)));
  };
}

export function generateInvoice(order, address) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;
    const { streetAddress: billingAddress } = address;

    dispatch(setLoading(true));
    httpClient
      .post(`${order['@id']}/invoice`, {
        billingAddress,
      })
      .then(res => {
        dispatch(updateOrderSuccess(res));
        dispatch(setLoading(false));
      })
      .catch(e => {
        dispatch(setLoading(false));
        dispatch(
          setModal({
            show: true,
            skippable: true,
            content: i18next.t('NET_FAILED'),
            type: 'error',
          }),
        );
      });
  };
}

export function shareInvoice(order) {
  return (dispatch, getState) => {
    const { settings, httpClient } = getState().app;
    const { number } = order;

    httpClient
      .get(`${order['@id']}/invoice`)
      .then(async res => {
        Share.open({
          title: ['Invoice', settings.brand_name, number].join(' '),
          url: `data:application/pdf;base64,${res.invoice}`,
          filename: [settings.brand_name, number].join('_'),
          type: 'application/pdf',
        });
      })
      .catch(err => {
        err && console.log(err);
      });
  };
}

export function search(q) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    dispatch(searchRequest());

    httpClient
      .get(`/api/search/shops_products?q=${q}`)
      .then(res => dispatch(searchSuccess(res['hydra:member'])))
      .catch(e => dispatch(searchFailure(e)));
  };
}

export function loadAndNavigateToRestaurante(id) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    dispatch(getRestaurantRequest());

    return httpClient
      .get(`/api/restaurants/${id}`)
      .then(restaurant => {
        return httpClient
          .get(restaurant['@id'] + '/timing', { anonymous: true })
          .then(timing => {
            restaurant.timing = timing;
            return restaurant;
          })
          .catch(() => {
            return restaurant;
          });
      })
      .then(restaurantWithTiming => {
        dispatch(setRestaurant(restaurantWithTiming['@id']));
        dispatch(getRestaurantSuccess());
        NavigationHolder.navigate('CheckoutRestaurant', {
          restaurant: restaurantWithTiming,
        });
      })
      .catch(e => dispatch(getRestaurantFailure(e)));
  };
}

export function updateLoopeatReturns(returns) {
  return (dispatch, getState) => {
    const { cart, token } = selectCart(getState());
    const httpClient = selectHttpClient(getState());

    dispatch(checkoutRequest());

    httpClient
      .post(
        cart['@id'] + '/loopeat_returns',
        {
          returns,
        },
        {
          headers: selectCheckoutAuthorizationHeaders(getState(), cart, token),
        },
      )
      .then(res => {
        dispatch(updateCartSuccess(res));
      })
      .catch(e => dispatch(checkoutFailure(e)));
  };
}
