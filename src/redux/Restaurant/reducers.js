import {
  ACCEPT_ORDER_FAILURE,
  ACCEPT_ORDER_REQUEST,
  ACCEPT_ORDER_SUCCESS,
  BLUETOOTH_DISABLED,
  BLUETOOTH_ENABLED,
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
  SET_NEXT_PRODUCTS_PAGE,
  SUNMI_PRINTER_DETECTED,
  BLUETOOTH_STARTED,
} from './actions'

import {
  LOAD_MY_RESTAURANTS_FAILURE,
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
} from '../App/actions'

import {
  MESSAGE,
} from '../middlewares/CentrifugoMiddleware/actions'

import moment from 'moment'
import _ from 'lodash'

const initialState = {
  fetchError: null,  // Error object describing the error
  isFetching: false, // Flag indicating active HTTP request
  orders: [],        // Array of orders
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
  printer: null,
  productOptions: [],
  isSunmiPrinter: false,
  bluetoothStarted: false,
}

const spliceOrders = (state, payload) => {

  const orderIndex = _.findIndex(state.orders, order => order['@id'] === payload['@id'])

  if (orderIndex !== -1) {
    const newOrders = state.orders.slice(0)
    newOrders.splice(orderIndex, 1, Object.assign({}, payload))

    return newOrders
  }

  return state.orders
}

const addOrReplace = (state, payload) => {

  const newOrders = state.orders.slice(0)

  const orderIndex = _.findIndex(state.orders, o => o['@id'] === payload['@id'])
  if (orderIndex !== -1) {
    newOrders.splice(orderIndex, 1, { ...payload })

    return newOrders
  }

  return newOrders.concat([payload])
}

const spliceProducts = (state, payload) => {

  const productIndex = _.findIndex(state.products, product => product['@id'] === payload['@id'])

  if (productIndex !== -1) {
    const newProducts = state.products.slice(0)
    newProducts.splice(productIndex, 1, Object.assign({}, payload))

    return newProducts
  }

  return state.products
}

const spliceProductOptions = (state, payload) => {

  const productOptionIndex = _.findIndex(state, productOption => {
    return _.findIndex(productOption.values, productOptionValue => productOptionValue['@id'] === payload.productOptionValue['@id']) !== -1
  })

  if (productOptionIndex !== -1) {

    const newProductOptions = state.slice()

    const productOptionValueIndex =
      _.findIndex(state[productOptionIndex].values, productOptionValue => productOptionValue['@id'] === payload.productOptionValue['@id'])

    newProductOptions[productOptionIndex].values[productOptionValueIndex].enabled = payload.enabled

    return newProductOptions
  }

  return state
}

export default (state = initialState, action = {}) => {
  let newState

  switch (action.type) {
    case LOAD_ORDERS_REQUEST:
    case LOAD_ORDER_REQUEST:
    case ACCEPT_ORDER_REQUEST:
    case LOAD_MY_RESTAURANTS_REQUEST:
    case REFUSE_ORDER_REQUEST:
    case DELAY_ORDER_REQUEST:
    case FULFILL_ORDER_REQUEST:
    case CANCEL_ORDER_REQUEST:
    case CHANGE_STATUS_REQUEST:
    case LOAD_PRODUCTS_REQUEST:
    case CLOSE_RESTAURANT_REQUEST:
    case DELETE_OPENING_HOURS_SPECIFICATION_REQUEST:
    case LOAD_MENUS_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
      }

    case LOAD_ORDERS_FAILURE:
    case LOAD_ORDER_FAILURE:
    case ACCEPT_ORDER_FAILURE:
    case LOAD_MY_RESTAURANTS_FAILURE:
    case REFUSE_ORDER_FAILURE:
    case DELAY_ORDER_FAILURE:
    case FULFILL_ORDER_FAILURE:
    case CANCEL_ORDER_FAILURE:
    case CHANGE_STATUS_FAILURE:
    case LOAD_PRODUCTS_FAILURE:
    case CLOSE_RESTAURANT_FAILURE:
    case DELETE_OPENING_HOURS_SPECIFICATION_FAILURE:
    case LOAD_MENUS_FAILURE:
      return {
        ...state,
        fetchError: action.payload || action.error,
        isFetching: false,
      }

    case CHANGE_PRODUCT_ENABLED_REQUEST:
      return {
        ...state,
        fetchError: false,
        isFetching: true,
        products: spliceProducts(state, {
          ...action.payload.product,
          enabled: action.payload.enabled,
        }),
      }

    case CHANGE_PRODUCT_ENABLED_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error,
        isFetching: false,
        products: spliceProducts(state, {
          ...action.payload.product,
          enabled: action.payload.enabled,
        }),
      }

    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST:
    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: action.type === CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST,
        productOptions: spliceProductOptions(state.productOptions, action.payload),
      }

    case CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE:
      return {
        ...state,
        fetchError: action.payload.error,
        isFetching: false,
        productOptions: spliceProductOptions(state.productOptions, action.payload),
      }

    case LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: action.payload,
      }

    case LOAD_ORDER_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        orders: addOrReplace(state, action.payload),
      }

    case ACCEPT_ORDER_SUCCESS:
    case REFUSE_ORDER_SUCCESS:
    case DELAY_ORDER_SUCCESS:
    case FULFILL_ORDER_SUCCESS:
    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        orders: spliceOrders(state, action.payload),
        fetchError: false,
        isFetching: false,
      }

    case LOAD_MY_RESTAURANTS_SUCCESS:

      newState = {
        ...state,
        fetchError: false,
        isFetching: false,
        myRestaurants: action.payload,
      }

      if (action.payload.length > 0) {
        const restaurant = _.first(action.payload)

        newState = {
          ...newState,
          // We select by default the first restaurant from the list
          // Most of the time, users will own only one restaurant
          restaurant,
        }
      }

      return newState

    case LOAD_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: action.payload,
      }

    case LOAD_PRODUCT_OPTIONS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        productOptions: action.payload,
      }

    case LOAD_MORE_PRODUCTS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: state.products.concat(action.payload),
      }

    case CHANGE_PRODUCT_ENABLED_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        products: spliceProducts(state, action.payload),
      }

    case CLOSE_RESTAURANT_SUCCESS:

      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload,
      }

    case DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS:

      const { specialOpeningHoursSpecification } = state

      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: {
          ...state.restaurant,
          specialOpeningHoursSpecification: _.filter(
            specialOpeningHoursSpecification,
            openingHoursSpecification => openingHoursSpecification['@id'] !== action.payload['@id']
          ),
        },
      }

    case CHANGE_STATUS_SUCCESS:
      return {
        ...state,
        fetchError: false,
        isFetching: false,
        restaurant: action.payload,
      }

    case CHANGE_RESTAURANT:

      return {
        ...state,
        restaurant: action.payload,
      }

    case CHANGE_DATE:
      return {
        ...state,
        date: action.payload,
      }

    case SET_NEXT_PRODUCTS_PAGE:
      return {
        ...state,
        nextProductsPage: action.payload,
      }

    case SET_HAS_MORE_PRODUCTS:
      return {
        ...state,
        hasMoreProducts: action.payload,
      }

    case LOAD_MENUS_SUCCESS:

      return {
        ...state,
        fetchError: false,
        isFetching: false,
        menus: action.payload.slice(0).map(menu => ({
          ...menu,
          active: menu['@id'] === state.restaurant.hasMenu,
        })),
      }

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
      }

    case PRINTER_CONNECTED:

      return {
        ...state,
        printer: action.payload,
      }

    case PRINTER_DISCONNECTED:

      return {
        ...state,
        printer: null,
      }

    case BLUETOOTH_ENABLED:

      return {
        ...state,
        bluetoothEnabled: true,
      }

    case BLUETOOTH_DISABLED:

      return {
        ...state,
        bluetoothEnabled: false,
      }

    case BLUETOOTH_START_SCAN:

      return {
        ...state,
        isScanningBluetooth: true,
      }

    case BLUETOOTH_STOP_SCAN:

      return {
        ...state,
        isScanningBluetooth: false,
      }

    case SUNMI_PRINTER_DETECTED:

      return {
        ...state,
        isSunmiPrinter: true,
      }

    case MESSAGE:

      if (action.payload.name && action.payload.data) {

        const { name, data } = action.payload

        switch (name) {
          case 'order:created':
          case 'order:accepted':
          case 'order:picked':
          case 'order:cancelled':

            // FIXME
            // Fix this on API side
            let newOrder = { ...data.order }
            if (name === 'order:cancelled' && newOrder.state !== 'cancelled') {
              newOrder = {
                ...newOrder,
                state: 'cancelled',
              }
            }
            if (name === 'order:accepted' && newOrder.state !== 'accepted') {
              newOrder = {
                ...newOrder,
                state: 'accepted',
              }
            }

            return {
              ...state,
              orders: addOrReplace(state, newOrder),
            }
          default:
            break
        }
      }

      return state

    case BLUETOOTH_STARTED:

      return {
        ...state,
        bluetoothStarted: true,
      }
  }

  return state
}
