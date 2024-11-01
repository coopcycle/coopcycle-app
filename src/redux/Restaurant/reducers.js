import moment from 'moment';
import _ from 'lodash';

import {
  ACCEPT_ORDER_FAILURE,
  ACCEPT_ORDER_REQUEST,
  ACCEPT_ORDER_SUCCESS,
  BLUETOOTH_DISABLED,
  BLUETOOTH_ENABLED,
  BLUETOOTH_STARTED,
  BLUETOOTH_START_SCAN,
  BLUETOOTH_STOP_SCAN,
  CANCEL_ORDER_FAILURE,
  CANCEL_ORDER_REQUEST,
  CANCEL_ORDER_SUCCESS,
  CHANGE_DATE,
  CHANGE_PRODUCT_ENABLED_FAILURE,
  CHANGE_PRODUCT_ENABLED_REQUEST,
  CHANGE_PRODUCT_ENABLED_SUCCESS,
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE,
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST,
  CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS,
  CHANGE_RESTAURANT,
  CHANGE_STATUS_FAILURE,
  CHANGE_STATUS_REQUEST,
  CHANGE_STATUS_SUCCESS,
  CLOSE_RESTAURANT_FAILURE,
  CLOSE_RESTAURANT_REQUEST,
  CLOSE_RESTAURANT_SUCCESS,
  DELAY_ORDER_FAILURE,
  DELAY_ORDER_REQUEST,
  DELAY_ORDER_SUCCESS,
  DELETE_OPENING_HOURS_SPECIFICATION_FAILURE,
  DELETE_OPENING_HOURS_SPECIFICATION_REQUEST,
  DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS,
  FULFILL_ORDER_FAILURE,
  FULFILL_ORDER_REQUEST,
  FULFILL_ORDER_SUCCESS,
  LOAD_MENUS_FAILURE,
  LOAD_MENUS_REQUEST,
  LOAD_MENUS_SUCCESS,
  LOAD_MORE_PRODUCTS_SUCCESS,
  LOAD_ORDERS_FAILURE,
  LOAD_ORDERS_REQUEST,
  LOAD_ORDERS_SUCCESS,
  LOAD_ORDER_FAILURE,
  LOAD_ORDER_REQUEST,
  LOAD_ORDER_SUCCESS,
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCT_OPTIONS_SUCCESS,
  PRINTER_CONNECTED,
  PRINTER_DISCONNECTED,
  REFUSE_ORDER_FAILURE,
  REFUSE_ORDER_REQUEST,
  REFUSE_ORDER_SUCCESS,
  SET_CURRENT_MENU,
  SET_HAS_MORE_PRODUCTS,
  SET_LOOPEAT_FORMATS,
  SET_NEXT_PRODUCTS_PAGE,
  SUNMI_PRINTER_DETECTED,
  UPDATE_LOOPEAT_FORMATS_SUCCESS,
  finishPreparing,
  printFulfilled,
  printPending,
  printRejected,
  setPrintNumberOfCopies,
  startPreparing,
} from './actions';

import {
  LOAD_MY_RESTAURANTS_FAILURE,
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
} from '../App/actions';

import { CENTRIFUGO_MESSAGE } from '../middlewares/CentrifugoMiddleware/actions';

import { EVENT as EVENT_ORDER, STATE } from '../../domain/Order';

const initialState = {
  fetchError: null, // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  orders: [], // Array of orders
  myRestaurants: [], // Array of restaurants
  date: moment(),
  status: 'available',
  restaurant: null,
  nextProductsPage: null,
  hasMoreProducts: false,
  products: [],
  menus: [],
  bluetoothEnabled: false,
  isScanningBluetooth: false,
  /**
   * Peripheral (react-native-ble-manager)
   */
  printer: null,
  productOptions: [],
  isSunmiPrinter: false,
  bluetoothStarted: false,
  loopeatFormats: {},
  /**
   * {
   *   [orderId]: {
   *     copiesToPrint: number,
   *     failedAttempts: number,
   *   }
   * }
   */
  ordersToPrint: {},
  printingOrderId: null,
  preferences: {
    autoAcceptOrders: {
      printNumberOfCopies: 1,
      printMaxFailedAttempts: 3,
    },
  },
};

const spliceOrders = (state, payload) => {
  const orderIndex = _.findIndex(
    state.orders,
    order => order['@id'] === payload['@id'],
  );

  if (orderIndex !== -1) {
    const newOrders = state.orders.slice(0);
    newOrders.splice(orderIndex, 1, Object.assign({}, payload));

    return newOrders;
  }

  return state.orders;
};

const addOrReplace = (state, payload) => {
  const newOrders = state.orders.slice(0);

  const orderIndex = _.findIndex(
    state.orders,
    o => o['@id'] === payload['@id'],
  );
  if (orderIndex !== -1) {
    newOrders.splice(orderIndex, 1, { ...payload });

    return newOrders;
  }

  return newOrders.concat([payload]);
};

const spliceProducts = (state, payload) => {
  const productIndex = _.findIndex(
    state.products,
    product => product['@id'] === payload['@id'],
  );

  if (productIndex !== -1) {
    const newProducts = state.products.slice(0);
    newProducts.splice(productIndex, 1, Object.assign({}, payload));

    return newProducts;
  }

  return state.products;
};

const spliceProductOptions = (state, payload) => {
  const productOptionIndex = _.findIndex(state, productOption => {
    return (
      _.findIndex(
        productOption.values,
        productOptionValue =>
          productOptionValue['@id'] === payload.productOptionValue['@id'],
      ) !== -1
    );
  });

  if (productOptionIndex !== -1) {
    const newProductOptions = state.slice();

    const productOptionValueIndex = _.findIndex(
      state[productOptionIndex].values,
      productOptionValue =>
        productOptionValue['@id'] === payload.productOptionValue['@id'],
    );

    newProductOptions[productOptionIndex].values[
      productOptionValueIndex
    ].enabled = payload.enabled;

    return newProductOptions;
  }

  return state;
};

function updateOrdersToPrint(state, orderId) {
  if (state.restaurant.autoAcceptOrdersEnabled) {
    if (state.ordersToPrint[orderId]) {
      return state;
    }

    const numberOfCopies =
      state.preferences.autoAcceptOrders.printNumberOfCopies;

    if (numberOfCopies === 0) {
      return state;
    }

    return {
      ...state,
      ordersToPrint: {
        ...state.ordersToPrint,
        [orderId]: {
          copiesToPrint: numberOfCopies,
          failedAttempts: 0,
        },
      },
    };
  } else {
    return state;
  }
}

export default (state = initialState, action = {}) => {
  let newState;

  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
    case LOAD_ORDER_REQUEST:
    case ACCEPT_ORDER_REQUEST:
    case LOAD_MY_RESTAURANTS_REQUEST:
    case REFUSE_ORDER_REQUEST:
    case DELAY_ORDER_REQUEST:
    case FULFILL_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
    case startPreparing.pending.type:
    case finishPreparing.pending.type:
    case CHANGE_STATUS_REQUEST:
    case LOAD_PRODUCTS_REQUEST:
    case CLOSE_RESTAURANT_REQUEST:
    case DELETE_OPENING_HOURS_SPECIFICATION_REQUEST:
    case LOAD_MENUS_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      };

    case LOAD_ORDERS_FAILURE:
    case LOAD_ORDER_FAILURE:
    case ACCEPT_ORDER_FAILURE:
    case LOAD_MY_RESTAURANTS_FAILURE:
    case REFUSE_ORDER_FAILURE:
    case DELAY_ORDER_FAILURE:
    case FULFILL_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case startPreparing.rejected.type:
    case finishPreparing.rejected.type:
    case CHANGE_STATUS_FAILURE:
    case LOAD_PRODUCTS_FAILURE:
    case CLOSE_RESTAURANT_FAILURE:
    case DELETE_OPENING_HOURS_SPECIFICATION_FAILURE:
    case LOAD_MENUS_FAILURE:
      return {
        ...state,
        fetchError: action.payload || action.error,
        isFetching: false,
      };

    case CHANGE_PRODUCT_ENABLED_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
        products: spliceProducts(state, {
          ...action.payload.product,
          enabled: action.payload.enabled,
        }),
      };

    case CHANGE_PRODUCT_ENABLED_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error,
        isFetching: false,
        products: spliceProducts(state, {
          ...action.payload.product,
          enabled: action.payload.enabled,
        }),
      };

    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST:
    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: action.type === CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST,
        productOptions: spliceProductOptions(
          state.productOptions,
          action.payload,
        ),
      };

    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error,
        isFetching: false,
        productOptions: spliceProductOptions(
          state.productOptions,
          action.payload,
        ),
      };

    case LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: action.payload,
      };

    case LOAD_ORDER_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: addOrReplace(state, action.payload),
      };

    case ACCEPT_ORDER_SUCCESS:
    case REFUSE_ORDER_SUCCESS:
    case DELAY_ORDER_SUCCESS:
    case FULFILL_ORDER_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
    case startPreparing.fulfilled.type:
    case finishPreparing.fulfilled.type:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      };

    case LOAD_MY_RESTAURANTS_SUCCESS:
      newState = {
        ...state,
        fetchError: false,
        isFetching: false,
        myRestaurants: action.payload,
      };

      if (action.payload.length > 0) {
        const restaurant = _.first(action.payload);

        newState = {
          ...newState,
          // We select by default the first restaurant from the list
          // Most of the time, users will own only one restaurant
          restaurant,
        };
      }

      return newState;

    case LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: action.payload,
      };

    case LOAD_PRODUCT_OPTIONS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        productOptions: action.payload,
      };

    case LOAD_MORE_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: state.products.concat(action.payload),
      };

    case CHANGE_PRODUCT_ENABLED_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: spliceProducts(state, action.payload),
      };

    case CLOSE_RESTAURANT_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload,
      };

    case DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS: {
      const { specialOpeningHoursSpecification } = state;

      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: {
          ...state.restaurant,
          specialOpeningHoursSpecification: _.filter(
            specialOpeningHoursSpecification,
            openingHoursSpecification =>
              openingHoursSpecification['@id'] !== action.payload['@id'],
          ),
        },
      };
    }

    case CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload,
      };

    case CHANGE_RESTAURANT:
      return {
        ...state,
        restaurant: action.payload,
      };

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload,
      };

    case SET_NEXT_PRODUCTS_PAGE:
      return {
        ...state,
        nextProductsPage: action.payload,
      };

    case SET_HAS_MORE_PRODUCTS:
      return {
        ...state,
        hasMoreProducts: action.payload,
      };

    case LOAD_MENUS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        menus: action.payload.slice(0).map(menu => ({
          ...menu,
          active: menu['@id'] === state.restaurant.hasMenu,
        })),
      };

    case SET_CURRENT_MENU:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: {
          ...state.restaurant,
          hasMenu: action.payload.menu['@id'],
        },
        menus: state.menus.slice(0).map(menu => ({
          ...menu,
          active: menu['@id'] === action.payload.menu['@id'],
        })),
      };

    case PRINTER_CONNECTED:
      return {
        ...state,
        printer: action.payload,
      };

    case PRINTER_DISCONNECTED:
      return {
        ...state,
        printer: null,
      };

    case BLUETOOTH_ENABLED:
      return {
        ...state,
        bluetoothEnabled: true,
      };

    case BLUETOOTH_DISABLED:
      return {
        ...state,
        bluetoothEnabled: false,
      };

    case BLUETOOTH_START_SCAN:
      return {
        ...state,
        isScanningBluetooth: true,
      };

    case BLUETOOTH_STOP_SCAN:
      return {
        ...state,
        isScanningBluetooth: false,
      };

    case SUNMI_PRINTER_DETECTED:
      return {
        ...state,
        isSunmiPrinter: true,
      };

    case CENTRIFUGO_MESSAGE:
      if (action.payload.name && action.payload.data) {
        const { name, data } = action.payload;

        switch (name) {
          case EVENT_ORDER.CREATED:
          case 'order:picked':
            return {
              ...state,
              orders: addOrReplace(state, data.order),
            };
          case EVENT_ORDER.STATE_CHANGED: {
            const updatedOrdersState = {
              ...state,
              orders: addOrReplace(state, data.order),
            };

            if (data.order.state === STATE.ACCEPTED) {
              return updateOrdersToPrint(updatedOrdersState, data.order['@id']);
            } else {
              return updatedOrdersState;
            }
          }

          default:
            break;
        }
      }

      return state;

    case printPending.type:
      return {
        ...state,
        printingOrderId: action.payload['@id'],
      };

    case printFulfilled.type: {
      const orderId = action.payload['@id'];
      const printTask = state.ordersToPrint[orderId];

      if (!printTask) {
        return {
          ...state,
          printingOrderId: null,
        };
      }

      if (printTask.copiesToPrint > 1) {
        // We have more copies to print
        return {
          ...state,
          printingOrderId: null,
          ordersToPrint: {
            ...state.ordersToPrint,
            [orderId]: {
              ...printTask,
              copiesToPrint: printTask.copiesToPrint - 1,
              failedAttempts: 0,
            },
          },
        };
      } else {
        // We have printed all needed copies

        const ordersToPrint = { ...state.ordersToPrint };
        delete ordersToPrint[orderId];

        return {
          ...state,
          printingOrderId: null,
          ordersToPrint: ordersToPrint,
        };
      }
    }

    case printRejected.type: {
      const orderId = action.payload['@id'];
      const printTask = state.ordersToPrint[orderId];

      if (!printTask) {
        return {
          ...state,
          printingOrderId: null,
        };
      }

      return {
        ...state,
        printingOrderId: null,
        ordersToPrint: {
          ...state.ordersToPrint,
          [orderId]: {
            ...printTask,
            failedAttempts: printTask.failedAttempts + 1,
          },
        },
      };
    }

    case setPrintNumberOfCopies.type: {
      const numberOfCopies = action.payload;
      return {
        ...state,
        preferences: {
          ...state.preferences,
          autoAcceptOrders: {
            ...state.preferences.autoAcceptOrders,
            printNumberOfCopies: numberOfCopies,
          },
        },
      };
    }

    case BLUETOOTH_STARTED:
      return {
        ...state,
        bluetoothStarted: true,
      };

    case SET_LOOPEAT_FORMATS:
      return {
        ...state,
        loopeatFormats: {
          ...state.loopeatFormats,
          [action.payload.order['@id']]: action.payload.loopeatFormats,
        },
      };

    case UPDATE_LOOPEAT_FORMATS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        orders: addOrReplace(state, action.payload),
      };
  }

  return state;
};
