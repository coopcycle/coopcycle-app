import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { createAction as createFsAction } from 'redux-actions';
import { CommonActions } from '@react-navigation/native';
import BleManager from 'react-native-ble-manager';
import _ from 'lodash';
import { Buffer } from 'buffer';

import DropdownHolder from '../../DropdownHolder';
import NavigationHolder from '../../NavigationHolder';

import { encodeForPrinter } from '../../utils/order';
import * as SunmiPrinterLibrary from '@mitsuharu/react-native-sunmi-printer-library';

import i18n from '../../i18n';

import {
  LOAD_MY_RESTAURANTS_FAILURE,
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
} from '../App/actions';
import { selectHttpClient } from '../App/selectors';
import { selectOrderById } from './selectors'

/*
 * Action Types
 */

export const LOAD_ORDERS_REQUEST = 'LOAD_ORDERS_REQUEST';
export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS';
export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE';

export const LOAD_ORDER_REQUEST = 'LOAD_ORDER_REQUEST';
export const LOAD_ORDER_SUCCESS = 'LOAD_ORDER_SUCCESS';
export const LOAD_ORDER_FAILURE = 'LOAD_ORDER_FAILURE';

export const ACCEPT_ORDER_REQUEST = 'ACCEPT_ORDER_REQUEST';
export const ACCEPT_ORDER_SUCCESS = 'ACCEPT_ORDER_SUCCESS';
export const ACCEPT_ORDER_FAILURE = 'ACCEPT_ORDER_FAILURE';

export const REFUSE_ORDER_REQUEST = 'REFUSE_ORDER_REQUEST';
export const REFUSE_ORDER_SUCCESS = 'REFUSE_ORDER_SUCCESS';
export const REFUSE_ORDER_FAILURE = 'REFUSE_ORDER_FAILURE';

export const DELAY_ORDER_REQUEST = 'DELAY_ORDER_REQUEST';
export const DELAY_ORDER_SUCCESS = 'DELAY_ORDER_SUCCESS';
export const DELAY_ORDER_FAILURE = 'DELAY_ORDER_FAILURE';

export const FULFILL_ORDER_REQUEST = 'FULFILL_ORDER_REQUEST';
export const FULFILL_ORDER_SUCCESS = 'FULFILL_ORDER_SUCCESS';
export const FULFILL_ORDER_FAILURE = 'FULFILL_ORDER_FAILURE';

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST';
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE';

export const CHANGE_STATUS_REQUEST = 'CHANGE_STATUS_REQUEST';
export const CHANGE_STATUS_SUCCESS = 'CHANGE_STATUS_SUCCESS';
export const CHANGE_STATUS_FAILURE = 'CHANGE_STATUS_FAILURE';

export const CHANGE_RESTAURANT = 'CHANGE_RESTAURANT';
export const CHANGE_DATE = 'CHANGE_DATE';

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST';
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE';

export const LOAD_PRODUCT_OPTIONS_SUCCESS = 'LOAD_PRODUCT_OPTIONS_SUCCESS';

export const LOAD_MENUS_REQUEST = 'LOAD_MENUS_REQUEST';
export const LOAD_MENUS_SUCCESS = 'LOAD_MENUS_SUCCESS';
export const LOAD_MENUS_FAILURE = 'LOAD_MENUS_FAILURE';
export const SET_CURRENT_MENU = 'SET_CURRENT_MENU';

export const SET_NEXT_PRODUCTS_PAGE = 'SET_NEXT_PRODUCTS_PAGE';
export const SET_HAS_MORE_PRODUCTS = 'SET_HAS_MORE_PRODUCTS';

export const LOAD_MORE_PRODUCTS_SUCCESS = 'LOAD_MORE_PRODUCTS_SUCCESS';

export const CHANGE_PRODUCT_ENABLED_REQUEST = 'CHANGE_PRODUCT_ENABLED_REQUEST';
export const CHANGE_PRODUCT_ENABLED_SUCCESS = 'CHANGE_PRODUCT_ENABLED_SUCCESS';
export const CHANGE_PRODUCT_ENABLED_FAILURE = 'CHANGE_PRODUCT_ENABLED_FAILURE';

export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST =
  'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST';
export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS =
  'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS';
export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE =
  'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE';

export const CLOSE_RESTAURANT_REQUEST = 'CLOSE_RESTAURANT_REQUEST';
export const CLOSE_RESTAURANT_SUCCESS = 'CLOSE_RESTAURANT_SUCCESS';
export const CLOSE_RESTAURANT_FAILURE = 'CLOSE_RESTAURANT_FAILURE';

export const DELETE_OPENING_HOURS_SPECIFICATION_REQUEST =
  'DELETE_OPENING_HOURS_SPECIFICATION_REQUEST';
export const DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS =
  'DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS';
export const DELETE_OPENING_HOURS_SPECIFICATION_FAILURE =
  'DELETE_OPENING_HOURS_SPECIFICATION_FAILURE';

export const PRINTER_CONNECTED = '@restaurant/PRINTER_CONNECTED';
export const PRINTER_DISCONNECTED = '@restaurant/PRINTER_DISCONNECTED';
export const BLUETOOTH_ENABLED = '@restaurant/BLUETOOTH_ENABLED';
export const BLUETOOTH_DISABLED = '@restaurant/BLUETOOTH_DISABLED';
export const BLUETOOTH_START_SCAN = '@restaurant/BLUETOOTH_START_SCAN';
export const BLUETOOTH_STOP_SCAN = '@restaurant/BLUETOOTH_STOP_SCAN';
export const BLUETOOTH_STARTED = '@restaurant/BLUETOOTH_STARTED';

export const SUNMI_PRINTER_DETECTED = '@restaurant/SUNMI_PRINTER_DETECTED';

export const SET_LOOPEAT_FORMATS = '@restaurant/SET_LOOPEAT_FORMATS';
export const UPDATE_LOOPEAT_FORMATS_SUCCESS =
  '@restaurant/UPDATE_LOOPEAT_FORMATS_SUCCESS';

/*
 * Action Creators
 */

const loadMyRestaurantsRequest = createFsAction(LOAD_MY_RESTAURANTS_REQUEST);
const loadMyRestaurantsSuccess = createFsAction(LOAD_MY_RESTAURANTS_SUCCESS);
const loadMyRestaurantsFailure = createFsAction(LOAD_MY_RESTAURANTS_FAILURE);

export const loadOrdersRequest = createFsAction(LOAD_ORDERS_REQUEST);
export const loadOrdersSuccess = createFsAction(LOAD_ORDERS_SUCCESS);
export const loadOrdersFailure = createFsAction(LOAD_ORDERS_FAILURE);

export const loadOrderRequest = createFsAction(LOAD_ORDER_REQUEST);
export const loadOrderSuccess = createFsAction(LOAD_ORDER_SUCCESS);
export const loadOrderFailure = createFsAction(LOAD_ORDER_FAILURE);

export const loadMenusRequest = createFsAction(LOAD_MENUS_REQUEST);
export const loadMenusSuccess = createFsAction(LOAD_MENUS_SUCCESS);
export const loadMenusFailure = createFsAction(LOAD_MENUS_FAILURE);
export const setCurrentMenu = createFsAction(
  SET_CURRENT_MENU,
  (restaurant, menu) => ({ restaurant, menu }),
);

export const acceptOrderRequest = createFsAction(ACCEPT_ORDER_REQUEST);
export const acceptOrderSuccess = createFsAction(ACCEPT_ORDER_SUCCESS);
export const acceptOrderFailure = createFsAction(ACCEPT_ORDER_FAILURE);

export const refuseOrderRequest = createFsAction(REFUSE_ORDER_REQUEST);
export const refuseOrderSuccess = createFsAction(REFUSE_ORDER_SUCCESS);
export const refuseOrderFailure = createFsAction(REFUSE_ORDER_FAILURE);

export const delayOrderRequest = createFsAction(DELAY_ORDER_REQUEST);
export const delayOrderSuccess = createFsAction(DELAY_ORDER_SUCCESS);
export const delayOrderFailure = createFsAction(DELAY_ORDER_FAILURE);

export const fulfillOrderRequest = createFsAction(FULFILL_ORDER_REQUEST);
export const fulfillOrderSuccess = createFsAction(FULFILL_ORDER_SUCCESS);
export const fulfillOrderFailure = createFsAction(FULFILL_ORDER_FAILURE);

export const cancelOrderRequest = createFsAction(CANCEL_ORDER_REQUEST);
export const cancelOrderSuccess = createFsAction(CANCEL_ORDER_SUCCESS);
export const cancelOrderFailure = createFsAction(CANCEL_ORDER_FAILURE);

export const changeStatusRequest = createFsAction(CHANGE_STATUS_REQUEST);
export const changeStatusSuccess = createFsAction(CHANGE_STATUS_SUCCESS);
export const changeStatusFailure = createFsAction(CHANGE_STATUS_FAILURE);

export const changeRestaurant = createFsAction(CHANGE_RESTAURANT);
export const changeDate = createFsAction(CHANGE_DATE);

export const loadProductsRequest = createFsAction(LOAD_PRODUCTS_REQUEST);
export const loadProductsSuccess = createFsAction(LOAD_PRODUCTS_SUCCESS);
export const loadProductsFailure = createFsAction(LOAD_PRODUCTS_FAILURE);

export const loadProductOptionsSuccess = createFsAction(
  LOAD_PRODUCT_OPTIONS_SUCCESS,
);

export const setNextProductsPage = createFsAction(SET_NEXT_PRODUCTS_PAGE);
export const loadMoreProductsSuccess = createFsAction(
  LOAD_MORE_PRODUCTS_SUCCESS,
);
export const setHasMoreProducts = createFsAction(SET_HAS_MORE_PRODUCTS);

export const changeProductEnabledRequest = createFsAction(
  CHANGE_PRODUCT_ENABLED_REQUEST,
  (product, enabled) => ({ product, enabled }),
);
export const changeProductEnabledSuccess = createFsAction(
  CHANGE_PRODUCT_ENABLED_SUCCESS,
);
export const changeProductEnabledFailure = createFsAction(
  CHANGE_PRODUCT_ENABLED_FAILURE,
  (error, product, enabled) => ({ error, product, enabled }),
);

export const changeProductOptionValueEnabledRequest = createFsAction(
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST,
  (productOptionValue, enabled) => ({ productOptionValue, enabled }),
);
export const changeProductOptionValueEnabledSuccess = createFsAction(
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS,
  (productOptionValue, enabled) => ({ productOptionValue, enabled }),
);
export const changeProductOptionValueEnabledFailure = createFsAction(
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE,
  (error, productOptionValue, enabled) => ({
    error,
    productOptionValue,
    enabled,
  }),
);

export const closeRestaurantRequest = createFsAction(CLOSE_RESTAURANT_REQUEST);
export const closeRestaurantSuccess = createFsAction(CLOSE_RESTAURANT_SUCCESS);
export const closeRestaurantFailure = createFsAction(CLOSE_RESTAURANT_FAILURE);

export const deleteOpeningHoursSpecificationRequest = createFsAction(
  DELETE_OPENING_HOURS_SPECIFICATION_REQUEST,
);
export const deleteOpeningHoursSpecificationSuccess = createFsAction(
  DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS,
);
export const deleteOpeningHoursSpecificationFailure = createFsAction(
  DELETE_OPENING_HOURS_SPECIFICATION_FAILURE,
);

export const printerConnected = createFsAction(PRINTER_CONNECTED);
export const printerDisconnected = createFsAction(PRINTER_DISCONNECTED);

export const bluetoothEnabled = createFsAction(BLUETOOTH_ENABLED);
export const bluetoothDisabled = createFsAction(BLUETOOTH_DISABLED);
const _bluetoothStartScan = createFsAction(BLUETOOTH_START_SCAN);
export const bluetoothStopScan = createFsAction(BLUETOOTH_STOP_SCAN);
export const bluetoothStarted = createFsAction(BLUETOOTH_STARTED);

export const sunmiPrinterDetected = createFsAction(SUNMI_PRINTER_DETECTED);

export const setLoopeatFormats = createFsAction(
  SET_LOOPEAT_FORMATS,
  (order, loopeatFormats) => ({ order, loopeatFormats }),
);
export const updateLoopeatFormatsSuccess = createFsAction(
  UPDATE_LOOPEAT_FORMATS_SUCCESS,
);

export const printPending = createAction('PRINT_PENDING');
export const printFulfilled = createAction('PRINT_FULFILLED');
export const printRejected = createAction('PRINT_REJECTED');

/*
 * Thunk Creators
 */

export function loadMyRestaurants() {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;
    dispatch(loadMyRestaurantsRequest());

    return httpClient
      .get('/api/me/restaurants')
      .then(res => dispatch(loadMyRestaurantsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadMyRestaurantsFailure(e)));
  };
}

export function loadOrders(restaurant, date, cb) {
  return function (dispatch, getState) {
    const httpClient = getState().app.httpClient;
    dispatch(loadOrdersRequest());

    return httpClient
      .get(`${restaurant['@id']}/orders?date=${date}`)
      .then(res => {
        dispatch(loadOrdersSuccess(res['hydra:member']));
        if (cb && typeof cb === 'function') {
          cb(res);
        }
      })
      .catch(e => dispatch(loadOrdersFailure(e)));
  };
}

export function loadMenus(restaurant, date) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(loadMenusRequest());

    httpClient
      .get(`${restaurant['@id']}/menus`)
      .then(res => dispatch(loadMenusSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadMenusFailure(e)));
  };
}

export function activateMenu(restaurant, menu) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(loadMenusRequest());

    httpClient
      .put(`${restaurant['@id']}`, {
        hasMenu: menu['@id'],
      })
      .then(res => dispatch(setCurrentMenu(restaurant, menu)))
      .catch(e => dispatch(loadMenusFailure(e)));
  };
}

function gotoOrder(restaurant, order) {
  NavigationHolder.dispatch(
    CommonActions.navigate({
      name: 'RestaurantNav',
      params: {
        screen: 'Main',
        params: {
          restaurant,
          // We don't want to load orders again when navigating
          loadOrders: false,
          screen: 'RestaurantOrder',
          params: {
            order,
          },
        },
      },
    }),
  );
}

export function loadOrder(order, cb) {
  return function (dispatch, getState) {
    const { app, restaurant } = getState();
    const { httpClient } = app;

    const sameOrder = _.find(restaurant.orders, o => o['@id'] === order);

    // Optimization: don't reload the order if already loaded
    if (sameOrder) {
      // gotoOrder(sameOrder.restaurant, sameOrder)
      if (cb && typeof cb === 'function') {
        setTimeout(() => cb(sameOrder), 0);
      }
      return;
    }

    dispatch(loadOrderRequest());

    return httpClient
      .get(order)
      .then(res => {
        dispatch(loadOrderSuccess(res));
        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(res), 0);
        }
      })
      .catch(e => {
        dispatch(loadOrderFailure(e));
        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(), 0);
        }
      });
  };
}

export function loadOrderAndNavigate(order, cb) {
  return function (dispatch, getState) {
    const { app, restaurant } = getState();
    const { httpClient } = app;

    const sameOrder = _.find(restaurant.orders, o => o['@id'] === order);

    // Optimization: don't reload the order if already loaded
    if (sameOrder) {
      gotoOrder(sameOrder.restaurant, sameOrder);
      return;
    }

    dispatch(loadOrderRequest());

    return httpClient
      .get(order)
      .then(res => {
        dispatch(loadOrderSuccess(res));

        if (cb && typeof cb === 'function') {
          cb();
        }

        gotoOrder(res.restaurant, res);
      })
      .catch(e => {
        dispatch(loadOrderFailure(e));
        if (cb && typeof cb === 'function') {
          cb();
        }
      });
  };
}

export function acceptOrder(order, cb) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(acceptOrderRequest());

    return httpClient
      .put(order['@id'] + '/accept')
      .then(res => {
        dispatch(acceptOrderSuccess(res));

        DropdownHolder.getDropdown().alertWithType(
          'success',
          i18n.t('RESTAURANT_ORDER_ACCEPTED_CONFIRM_TITLE'),
          i18n.t('RESTAURANT_ORDER_ACCEPTED_CONFIRM_BODY', {
            number: order.number,
            id: order.id,
          }),
        );

        cb(res);
      })
      .catch(e => dispatch(acceptOrderFailure(e)));
  };
}

export const startPreparing = createAsyncThunk(
  'order/startPreparing',
  async (order, thunkAPI) => {
    const { getState } = thunkAPI;

    const httpClient = selectHttpClient(getState());

    return await httpClient.put(order['@id'] + '/start_preparing');
  },
);

export const finishPreparing = createAsyncThunk(
  'order/finishPreparing',
  async (order, thunkAPI) => {
    const { getState } = thunkAPI;

    const httpClient = selectHttpClient(getState());

    return await httpClient.put(order['@id'] + '/finish_preparing');
  },
);

export function refuseOrder(order, reason, cb) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(refuseOrderRequest());

    return httpClient
      .put(order['@id'] + '/refuse', { reason })
      .then(res => {
        dispatch(refuseOrderSuccess(res));
        cb(res);
      })
      .catch(e => dispatch(refuseOrderFailure(e)));
  };
}

export function delayOrder(order, delay, cb) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(delayOrderRequest());

    return httpClient
      .put(order['@id'] + '/delay', { delay })
      .then(res => {
        dispatch(delayOrderSuccess(res));
        cb(res);
      })
      .catch(e => dispatch(delayOrderFailure(e)));
  };
}

export function fulfillOrder(order, cb) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(fulfillOrderRequest());

    return httpClient
      .put(order['@id'] + '/fulfill', {})
      .then(res => {
        dispatch(fulfillOrderSuccess(res));
        if (cb && typeof cb === 'function') {
          cb(res);
        }
      })
      .catch(e => dispatch(fulfillOrderFailure(e)));
  };
}

export function cancelOrder(order, reason, cb) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(cancelOrderRequest());

    return httpClient
      .put(order['@id'] + '/cancel', { reason })
      .then(res => {
        dispatch(cancelOrderSuccess(res));

        DropdownHolder.getDropdown().alertWithType(
          'success',
          i18n.t('RESTAURANT_ORDER_CANCELLED_CONFIRM_TITLE'),
          i18n.t('RESTAURANT_ORDER_CANCELLED_CONFIRM_BODY', {
            number: order.number,
            id: order.id,
          }),
        );

        cb(res);
      })
      .catch(e => dispatch(cancelOrderFailure(e)));
  };
}

export function changeStatus(restaurant, state) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(changeStatusRequest());

    return httpClient
      .put(restaurant['@id'], { state })
      .then(res => dispatch(changeStatusSuccess(res)))
      .catch(e => dispatch(changeStatusFailure(e)));
  };
}

export function loadProducts(client, restaurant) {
  return function (dispatch) {
    dispatch(loadProductsRequest());

    return client
      .get(`${restaurant['@id']}/products`)
      .then(res => {
        if (res.hasOwnProperty('hydra:view')) {
          const hydraView = res['hydra:view'];
          if (hydraView.hasOwnProperty('hydra:next')) {
            dispatch(setNextProductsPage(hydraView['hydra:next']));
            dispatch(setHasMoreProducts(true));
          } else {
            // It means we have reached the last page
            dispatch(setHasMoreProducts(false));
          }
        } else {
          dispatch(setHasMoreProducts(false));
        }

        dispatch(loadProductsSuccess(res['hydra:member']));
      })
      .catch(e => dispatch(loadProductsFailure(e)));
  };
}

export function loadMoreProducts() {
  return function (dispatch, getState) {
    const { httpClient } = getState().app;
    const { nextProductsPage, hasMoreProducts } = getState().restaurant;

    if (!hasMoreProducts) {
      return;
    }

    dispatch(loadProductsRequest());

    return httpClient
      .get(nextProductsPage)
      .then(res => {
        const hydraView = res['hydra:view'];

        if (hydraView.hasOwnProperty('hydra:next')) {
          dispatch(setNextProductsPage(res['hydra:view']['hydra:next']));
          dispatch(setHasMoreProducts(true));
        } else {
          // It means we have reached the last page
          dispatch(setHasMoreProducts(false));
        }

        dispatch(loadMoreProductsSuccess(res['hydra:member']));
      })
      .catch(e => dispatch(loadProductsFailure(e)));
  };
}

export function changeProductEnabled(client, product, enabled) {
  return function (dispatch) {
    dispatch(changeProductEnabledRequest(product, enabled));

    return client
      .put(product['@id'], { enabled })
      .then(res => dispatch(changeProductEnabledSuccess(res)))
      .catch(e => dispatch(changeProductEnabledFailure(e, product, !enabled)));
  };
}

export function closeRestaurant(restaurant) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(closeRestaurantRequest());

    return httpClient
      .put(`${restaurant['@id']}/close`, {})
      .then(res => dispatch(closeRestaurantSuccess(res)))
      .catch(e => dispatch(closeRestaurantFailure(e)));
  };
}

export function deleteOpeningHoursSpecification(openingHoursSpecification) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(deleteOpeningHoursSpecificationRequest());

    return httpClient
      .delete(openingHoursSpecification['@id'])
      .then(res =>
        dispatch(
          deleteOpeningHoursSpecificationSuccess(openingHoursSpecification),
        ),
      )
      .catch(e => dispatch(deleteOpeningHoursSpecificationFailure(e)));
  };
}

function bluetoothErrorToString(e) {
  if (typeof e === 'string') {
    return e;
  }

  return e.message
    ? e.message
    : e.toString && typeof e.toString === 'function'
    ? e.toString()
    : e;
}

export function printOrderById(orderId) {
  return async (dispatch, getState) => {
    const order = selectOrderById(getState(), orderId);

    if (!order) {
      console.warn('Order not found', orderId);
      return;
    }

    await dispatch(printOrder(order))
  };
}

export function printOrder(order) {
  return async (dispatch, getState) => {
    dispatch(printPending(order));

    const { printer, isSunmiPrinter } = getState().restaurant;

    try {
      if (isSunmiPrinter) {
        await SunmiPrinterLibrary.prepare();
        await SunmiPrinterLibrary.sendRAWData(
          Buffer.from(encodeForPrinter(order, true)).toString('base64'),
        );
        dispatch(printFulfilled(order));
        return;
      }
    } catch (e) {
      console.warn('printOrder with SunmiPrinter failed', e);
    }

    if (!printer) {
      console.warn('No printer selected');
      dispatch(printRejected(order));
      return;
    }

    try {
      const isPeripheralConnected = await BleManager.isPeripheralConnected(
        printer.id,
        [],
      );

      // Try to reconnect first
      if (!isPeripheralConnected) {
        try {
          await BleManager.connect(printer.id);
        } catch (e) {
          dispatch(printerDisconnected());
          dispatch(printRejected(order));
          DropdownHolder.getDropdown().alertWithType(
            'error',
            i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
            bluetoothErrorToString(e),
          );
          return;
        }
      }

      const peripheralInfo = await BleManager.retrieveServices(printer.id);

      // We keep only writable characteristics

      const writableCharacteristics = _.filter(
        peripheralInfo.characteristics,
        characteristic => {
          if (!characteristic.properties) {
            return false;
          }

          // iOS
          if (Array.isArray(characteristic.properties)) {
            return _.includes(
              characteristic.properties,
              'WriteWithoutResponse',
            );
          }

          // Android
          return characteristic.properties.WriteWithoutResponse;
        },
      );

      if (writableCharacteristics.length > 0) {
        const encoded = encodeForPrinter(order);

        writableCharacteristics.sort((a, b) => {
          if (peripheralInfo.advertising.serviceUUIDs) {
            const isAdvertisedA = _.includes(
              peripheralInfo.advertising.serviceUUIDs,
              a.service,
            );
            const isAdvertisedB = _.includes(
              peripheralInfo.advertising.serviceUUIDs,
              b.service,
            );
            if (isAdvertisedA !== isAdvertisedB) {
              if (isAdvertisedA && !isAdvertisedB) {
                return -1;
              }
              if (isAdvertisedB && !isAdvertisedA) {
                return 1;
              }
            }
          }

          if (a.service.length === b.service.length) {
            return 0;
          }

          return a.service.length > b.service.length ? -1 : 1;
        });

        for (let i = 0; i < writableCharacteristics.length; i++) {
          const writableCharacteristic = writableCharacteristics[i];

          try {
            await BleManager.writeWithoutResponse(
              printer.id,
              writableCharacteristic.service,
              writableCharacteristic.characteristic,
              Array.from(encoded),
            );
            dispatch(printFulfilled(order));
          } catch (e) {
            console.warn('printOrder | Write failed', e);
            dispatch(printRejected(order));
          }
        }
      }
    } catch (e) {
      console.warn('printOrder | Error', e);
      dispatch(printRejected(order));
      DropdownHolder.getDropdown().alertWithType(
        'error',
        i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
        bluetoothErrorToString(e),
      );
    }
  };
}

export function connectPrinter(device, cb) {
  return function (dispatch) {
    BleManager.connect(device.id)
      .then(() => {
        dispatch(printerConnected(device));

        DropdownHolder.getDropdown().alertWithType(
          'success',
          i18n.t('RESTAURANT_PRINTER_CONNECTED_TITLE'),
          i18n.t('RESTAURANT_PRINTER_CONNECTED_BODY', {
            name: device.name || device.id,
          }),
        );

        cb && cb();
      })
      .catch(e => {
        DropdownHolder.getDropdown().alertWithType(
          'error',
          i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
          bluetoothErrorToString(e),
        );
      });
  };
}

export function disconnectPrinter(device, cb) {
  return function (dispatch) {
    BleManager.disconnect(device.id)
      // We use Promise.finally because if the state
      // contains a saved printer which is not connected anymore,
      // BleManager.disconnect will return an error
      .catch(e => console.warn('disconnectPrinter', e))
      .finally(() => {
        dispatch(printerDisconnected());

        DropdownHolder.getDropdown().alertWithType(
          'success',
          i18n.t('RESTAURANT_PRINTER_DISCONNECTED_TITLE'),
          i18n.t('RESTAURANT_PRINTER_DISCONNECTED_BODY', {
            name: device.name || device.id,
          }),
        );

        cb && cb();
      });
  };
}

export function loadProductOptions(restaurant) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(loadProductsRequest());

    return httpClient
      .get(`${restaurant['@id']}/product_options`)
      .then(res => {
        dispatch(loadProductOptionsSuccess(res['hydra:member']));
      })
      .catch(e => dispatch(loadProductsFailure(e)));
  };
}

export function changeProductOptionValueEnabled(productOptionValue, enabled) {
  return function (dispatch, getState) {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(
      changeProductOptionValueEnabledRequest(productOptionValue, enabled),
    );

    httpClient
      .put(productOptionValue['@id'], { enabled })
      .then(res =>
        dispatch(
          changeProductOptionValueEnabledSuccess(
            productOptionValue,
            res.enabled,
          ),
        ),
      )
      .catch(e =>
        dispatch(
          changeProductOptionValueEnabledSuccess(
            e,
            productOptionValue,
            !enabled,
          ),
        ),
      );
  };
}

export function bluetoothStartScan() {
  return function (dispatch, getState) {
    if (!getState().restaurant.bluetoothStarted) {
      BleManager.start({ showAlert: false }).then(() => {
        dispatch(bluetoothStarted());
        BleManager.scan([], 30, true).then(() => {
          dispatch(_bluetoothStartScan());
        });
      });
    } else {
      BleManager.scan([], 30, true).then(() => {
        dispatch(_bluetoothStartScan());
      });
    }
  };
}

export function loadLoopeatFormats(order) {
  return function (dispatch, getState) {
    const { httpClient } = getState().app;

    httpClient.get(order['@id'] + '/loopeat_formats').then(res => {
      dispatch(setLoopeatFormats(order, res.items));
    });
  };
}

export function updateLoopeatFormats(order, loopeatFormats, cb) {
  return (dispatch, getState) => {
    const { httpClient } = getState().app;

    httpClient
      .put(order['@id'] + '/loopeat_formats', {
        items: loopeatFormats,
      })
      .then(res => {
        dispatch(updateLoopeatFormatsSuccess(res));
        if (cb && typeof cb === 'function') {
          cb(res);
        }
      });
  };
}
