import { createAction } from 'redux-actions'
import { CommonActions } from '@react-navigation/native'
import BleManager from 'react-native-ble-manager'
import _ from 'lodash'

import DropdownHolder from '../../DropdownHolder'
import NavigationHolder from '../../NavigationHolder'

import { pushNotification } from '../App/actions'
import { encodeForPrinter } from '../../utils/order'

import i18n from '../../i18n'

import {
  LOAD_MY_RESTAURANTS_REQUEST,
  LOAD_MY_RESTAURANTS_SUCCESS,
  LOAD_MY_RESTAURANTS_FAILURE,
} from '../App/actions'

/*
 * Action Types
 */

export const LOAD_ORDERS_REQUEST = 'LOAD_ORDERS_REQUEST'
export const LOAD_ORDERS_SUCCESS = 'LOAD_ORDERS_SUCCESS'
export const LOAD_ORDERS_FAILURE = 'LOAD_ORDERS_FAILURE'

export const LOAD_ORDER_REQUEST = 'LOAD_ORDER_REQUEST'
export const LOAD_ORDER_SUCCESS = 'LOAD_ORDER_SUCCESS'
export const LOAD_ORDER_FAILURE = 'LOAD_ORDER_FAILURE'

export const ACCEPT_ORDER_REQUEST = 'ACCEPT_ORDER_REQUEST'
export const ACCEPT_ORDER_SUCCESS = 'ACCEPT_ORDER_SUCCESS'
export const ACCEPT_ORDER_FAILURE = 'ACCEPT_ORDER_FAILURE'

export const REFUSE_ORDER_REQUEST = 'REFUSE_ORDER_REQUEST'
export const REFUSE_ORDER_SUCCESS = 'REFUSE_ORDER_SUCCESS'
export const REFUSE_ORDER_FAILURE = 'REFUSE_ORDER_FAILURE'

export const DELAY_ORDER_REQUEST = 'DELAY_ORDER_REQUEST'
export const DELAY_ORDER_SUCCESS = 'DELAY_ORDER_SUCCESS'
export const DELAY_ORDER_FAILURE = 'DELAY_ORDER_FAILURE'

export const FULFILL_ORDER_REQUEST = 'FULFILL_ORDER_REQUEST'
export const FULFILL_ORDER_SUCCESS = 'FULFILL_ORDER_SUCCESS'
export const FULFILL_ORDER_FAILURE = 'FULFILL_ORDER_FAILURE'

export const CANCEL_ORDER_REQUEST = 'CANCEL_ORDER_REQUEST'
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS'
export const CANCEL_ORDER_FAILURE = 'CANCEL_ORDER_FAILURE'

export const CHANGE_STATUS_REQUEST = 'CHANGE_STATUS_REQUEST'
export const CHANGE_STATUS_SUCCESS = 'CHANGE_STATUS_SUCCESS'
export const CHANGE_STATUS_FAILURE = 'CHANGE_STATUS_FAILURE'

export const CHANGE_RESTAURANT = 'CHANGE_RESTAURANT'
export const CHANGE_DATE = 'CHANGE_DATE'

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST'
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS'
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE'

export const LOAD_PRODUCT_OPTIONS_SUCCESS = 'LOAD_PRODUCT_OPTIONS_SUCCESS'

export const LOAD_MENUS_REQUEST = 'LOAD_MENUS_REQUEST'
export const LOAD_MENUS_SUCCESS = 'LOAD_MENUS_SUCCESS'
export const LOAD_MENUS_FAILURE = 'LOAD_MENUS_FAILURE'
export const SET_CURRENT_MENU = 'SET_CURRENT_MENU'

export const SET_NEXT_PRODUCTS_PAGE = 'SET_NEXT_PRODUCTS_PAGE'
export const SET_HAS_MORE_PRODUCTS = 'SET_HAS_MORE_PRODUCTS'

export const LOAD_MORE_PRODUCTS_SUCCESS = 'LOAD_MORE_PRODUCTS_SUCCESS'

export const CHANGE_PRODUCT_ENABLED_REQUEST = 'CHANGE_PRODUCT_ENABLED_REQUEST'
export const CHANGE_PRODUCT_ENABLED_SUCCESS = 'CHANGE_PRODUCT_ENABLED_SUCCESS'
export const CHANGE_PRODUCT_ENABLED_FAILURE = 'CHANGE_PRODUCT_ENABLED_FAILURE'

export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST = 'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST'
export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS = 'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS'
export const CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE = 'CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE'

export const CLOSE_RESTAURANT_REQUEST = 'CLOSE_RESTAURANT_REQUEST'
export const CLOSE_RESTAURANT_SUCCESS = 'CLOSE_RESTAURANT_SUCCESS'
export const CLOSE_RESTAURANT_FAILURE = 'CLOSE_RESTAURANT_FAILURE'

export const DELETE_OPENING_HOURS_SPECIFICATION_REQUEST = 'DELETE_OPENING_HOURS_SPECIFICATION_REQUEST'
export const DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS = 'DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS'
export const DELETE_OPENING_HOURS_SPECIFICATION_FAILURE = 'DELETE_OPENING_HOURS_SPECIFICATION_FAILURE'

export const PRINTER_CONNECTED = '@restaurant/PRINTER_CONNECTED'
export const PRINTER_DISCONNECTED = '@restaurant/PRINTER_DISCONNECTED'
export const BLUETOOTH_ENABLED = '@restaurant/BLUETOOTH_ENABLED'
export const BLUETOOTH_DISABLED = '@restaurant/BLUETOOTH_DISABLED'
export const BLUETOOTH_START_SCAN = '@restaurant/BLUETOOTH_START_SCAN'
export const BLUETOOTH_STOP_SCAN = '@restaurant/BLUETOOTH_STOP_SCAN'

/*
 * Action Creators
 */

const loadMyRestaurantsRequest = createAction(LOAD_MY_RESTAURANTS_REQUEST)
const loadMyRestaurantsSuccess = createAction(LOAD_MY_RESTAURANTS_SUCCESS)
const loadMyRestaurantsFailure = createAction(LOAD_MY_RESTAURANTS_FAILURE)

export const loadOrdersRequest = createAction(LOAD_ORDERS_REQUEST)
export const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
export const loadOrdersFailure = createAction(LOAD_ORDERS_FAILURE)

export const loadOrderRequest = createAction(LOAD_ORDER_REQUEST)
export const loadOrderSuccess = createAction(LOAD_ORDER_SUCCESS)
export const loadOrderFailure = createAction(LOAD_ORDER_FAILURE)

export const loadMenusRequest = createAction(LOAD_MENUS_REQUEST)
export const loadMenusSuccess = createAction(LOAD_MENUS_SUCCESS)
export const loadMenusFailure = createAction(LOAD_MENUS_FAILURE)
export const setCurrentMenu = createAction(SET_CURRENT_MENU, (restaurant, menu) => ({ restaurant, menu }))

export const acceptOrderRequest = createAction(ACCEPT_ORDER_REQUEST)
export const acceptOrderSuccess = createAction(ACCEPT_ORDER_SUCCESS)
export const acceptOrderFailure = createAction(ACCEPT_ORDER_FAILURE)

export const refuseOrderRequest = createAction(REFUSE_ORDER_REQUEST)
export const refuseOrderSuccess = createAction(REFUSE_ORDER_SUCCESS)
export const refuseOrderFailure = createAction(REFUSE_ORDER_FAILURE)

export const delayOrderRequest = createAction(DELAY_ORDER_REQUEST)
export const delayOrderSuccess = createAction(DELAY_ORDER_SUCCESS)
export const delayOrderFailure = createAction(DELAY_ORDER_FAILURE)

export const fulfillOrderRequest = createAction(FULFILL_ORDER_REQUEST)
export const fulfillOrderSuccess = createAction(FULFILL_ORDER_SUCCESS)
export const fulfillOrderFailure = createAction(FULFILL_ORDER_FAILURE)

export const cancelOrderRequest = createAction(CANCEL_ORDER_REQUEST)
export const cancelOrderSuccess = createAction(CANCEL_ORDER_SUCCESS)
export const cancelOrderFailure = createAction(CANCEL_ORDER_FAILURE)

export const changeStatusRequest = createAction(CHANGE_STATUS_REQUEST)
export const changeStatusSuccess = createAction(CHANGE_STATUS_SUCCESS)
export const changeStatusFailure = createAction(CHANGE_STATUS_FAILURE)

export const changeRestaurant = createAction(CHANGE_RESTAURANT)
export const changeDate = createAction(CHANGE_DATE)

export const loadProductsRequest = createAction(LOAD_PRODUCTS_REQUEST)
export const loadProductsSuccess = createAction(LOAD_PRODUCTS_SUCCESS)
export const loadProductsFailure = createAction(LOAD_PRODUCTS_FAILURE)

export const loadProductOptionsSuccess = createAction(LOAD_PRODUCT_OPTIONS_SUCCESS)

export const setNextProductsPage = createAction(SET_NEXT_PRODUCTS_PAGE)
export const loadMoreProductsSuccess = createAction(LOAD_MORE_PRODUCTS_SUCCESS)
export const setHasMoreProducts = createAction(SET_HAS_MORE_PRODUCTS)

export const changeProductEnabledRequest = createAction(CHANGE_PRODUCT_ENABLED_REQUEST, (product, enabled) => ({ product, enabled }))
export const changeProductEnabledSuccess = createAction(CHANGE_PRODUCT_ENABLED_SUCCESS)
export const changeProductEnabledFailure = createAction(CHANGE_PRODUCT_ENABLED_FAILURE, (error, product, enabled) => ({ error, product, enabled }))

export const changeProductOptionValueEnabledRequest = createAction(CHANGE_PRODUCT_OPTION_VALUE_ENABLED_REQUEST, (productOptionValue, enabled) => ({ productOptionValue, enabled }))
export const changeProductOptionValueEnabledSuccess = createAction(CHANGE_PRODUCT_OPTION_VALUE_ENABLED_SUCCESS, (productOptionValue, enabled) => ({ productOptionValue, enabled }))
export const changeProductOptionValueEnabledFailure = createAction(CHANGE_PRODUCT_OPTION_VALUE_ENABLED_FAILURE, (error, productOptionValue, enabled) => ({ error, productOptionValue, enabled }))

export const closeRestaurantRequest = createAction(CLOSE_RESTAURANT_REQUEST)
export const closeRestaurantSuccess = createAction(CLOSE_RESTAURANT_SUCCESS)
export const closeRestaurantFailure = createAction(CLOSE_RESTAURANT_FAILURE)

export const deleteOpeningHoursSpecificationRequest = createAction(DELETE_OPENING_HOURS_SPECIFICATION_REQUEST)
export const deleteOpeningHoursSpecificationSuccess = createAction(DELETE_OPENING_HOURS_SPECIFICATION_SUCCESS)
export const deleteOpeningHoursSpecificationFailure = createAction(DELETE_OPENING_HOURS_SPECIFICATION_FAILURE)

export const printerConnected = createAction(PRINTER_CONNECTED)
export const printerDisconnected = createAction(PRINTER_DISCONNECTED)

export const bluetoothEnabled = createAction(BLUETOOTH_ENABLED)
export const bluetoothDisabled = createAction(BLUETOOTH_DISABLED)
export const bluetoothStartScan = createAction(BLUETOOTH_START_SCAN)
export const bluetoothStopScan = createAction(BLUETOOTH_STOP_SCAN)

/*
 * Thunk Creators
 */

export function loadMyRestaurants() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient
    dispatch(loadMyRestaurantsRequest())

    return httpClient.get('/api/me/restaurants')
      .then(res => dispatch(loadMyRestaurantsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadMyRestaurantsFailure(e)))
  }
}

export function loadOrders(restaurant, date, cb) {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient
    dispatch(loadOrdersRequest())

    return httpClient.get(`${restaurant['@id']}/orders?date=${date}`)
      .then(res => {
        dispatch(loadOrdersSuccess(res['hydra:member']))
        if (cb && typeof cb === 'function') {
          cb(res)
        }
      })
      .catch(e => dispatch(loadOrdersFailure(e)))
  }
}

export function loadMenus(restaurant, date) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(loadMenusRequest())

    httpClient.get(`${restaurant['@id']}/menus`)
      .then(res => dispatch(loadMenusSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadMenusFailure(e)))
  }
}

export function activateMenu(restaurant, menu) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(loadMenusRequest())

    httpClient.put(`${restaurant['@id']}`, {
      hasMenu: menu['@id'],
    })
      .then(res => dispatch(setCurrentMenu(restaurant, menu)))
      .catch(e => dispatch(loadMenusFailure(e)))
  }
}

function gotoOrder(restaurant, order) {
  NavigationHolder.dispatch(CommonActions.navigate({
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
  }))
}

export function loadOrder(order, cb) {

  return function (dispatch, getState) {

    const { app, restaurant } = getState()
    const { httpClient } = app

    const sameOrder = _.find(restaurant.orders, o => o['@id'] === order)

    // Optimization: don't reload the order if already loaded
    if (sameOrder) {
      // gotoOrder(sameOrder.restaurant, sameOrder)
      if (cb && typeof cb === 'function') {
        setTimeout(() => cb(sameOrder), 0)
      }
      return
    }

    dispatch(loadOrderRequest())

    return httpClient.get(order)
      .then(res => {
        dispatch(loadOrderSuccess(res))
        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(res), 0)
        }
      })
      .catch(e => {
        dispatch(loadOrderFailure(e))
        if (cb && typeof cb === 'function') {
          setTimeout(() => cb(), 0)
        }
      })
  }
}

export function loadOrderAndNavigate(order, cb) {

  return function (dispatch, getState) {

    const { app, restaurant } = getState()
    const { httpClient } = app

    const sameOrder = _.find(restaurant.orders, o => o['@id'] === order)

    // Optimization: don't reload the order if already loaded
    if (sameOrder) {
      gotoOrder(sameOrder.restaurant, sameOrder)
      return
    }

    dispatch(loadOrderRequest())

    return httpClient.get(order)
      .then(res => {

        dispatch(loadOrderSuccess(res))

        if (cb && typeof cb === 'function') {
          cb()
        }

        gotoOrder(res.restaurant, res)

      })
      .catch(e => {
        dispatch(loadOrderFailure(e))
        if (cb && typeof cb === 'function') {
          cb()
        }
      })
  }
}

export function loadOrderAndPushNotification(order) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(loadOrderRequest())

    return httpClient.get(order)
      .then(res => {
        dispatch(loadOrderSuccess(res))
        dispatch(pushNotification('order:created', { order: res }))
      })
      .catch(e => dispatch(loadOrderFailure(e)))
  }
}

export function acceptOrder(order, cb) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(acceptOrderRequest())

    return httpClient.put(order['@id'] + '/accept')
      .then(res => {

        dispatch(acceptOrderSuccess(res))

        DropdownHolder
          .getDropdown()
          .alertWithType(
            'success',
            i18n.t('RESTAURANT_ORDER_ACCEPTED_CONFIRM_TITLE'),
            i18n.t('RESTAURANT_ORDER_ACCEPTED_CONFIRM_BODY', { number: order.number, id: order.id })
          )

        cb(res)

      })
      .catch(e => dispatch(acceptOrderFailure(e)))
  }
}

export function refuseOrder(order, reason, cb) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(refuseOrderRequest())

    return httpClient.put(order['@id'] + '/refuse', { reason })
      .then(res => {
        dispatch(refuseOrderSuccess(res))
        cb(res)
      })
      .catch(e => dispatch(refuseOrderFailure(e)))
  }
}

export function delayOrder(order, delay, cb) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(delayOrderRequest())

    return httpClient.put(order['@id'] + '/delay', { delay })
      .then(res => {
        dispatch(delayOrderSuccess(res))
        cb(res)
      })
      .catch(e => dispatch(delayOrderFailure(e)))
  }
}

export function fulfillOrder(order, cb) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(fulfillOrderRequest())

    return httpClient.put(order['@id'] + '/fulfill', {})
      .then(res => {
        dispatch(fulfillOrderSuccess(res))
        if (cb && typeof cb === 'function') {
          cb(res)
        }
      })
      .catch(e => dispatch(fulfillOrderFailure(e)))
  }
}

export function cancelOrder(order, reason, cb) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(cancelOrderRequest())

    return httpClient.put(order['@id'] + '/cancel', { reason })
      .then(res => {

        dispatch(cancelOrderSuccess(res))

        DropdownHolder
          .getDropdown()
          .alertWithType(
            'success',
            i18n.t('RESTAURANT_ORDER_CANCELLED_CONFIRM_TITLE'),
            i18n.t('RESTAURANT_ORDER_CANCELLED_CONFIRM_BODY', { number: order.number, id: order.id })
          )

        cb(res)

      })
      .catch(e => dispatch(cancelOrderFailure(e)))
  }
}

export function changeStatus(restaurant, state) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(changeStatusRequest())

    return httpClient.put(restaurant['@id'], { state })
      .then(res => dispatch(changeStatusSuccess(res)))
      .catch(e => dispatch(changeStatusFailure(e)))
  }
}

export function loadProducts(client, restaurant) {

  return function (dispatch) {
    dispatch(loadProductsRequest())

    return client.get(`${restaurant['@id']}/products`)
      .then(res => {

        if (res.hasOwnProperty('hydra:view')) {
          const hydraView = res['hydra:view']
          if (hydraView.hasOwnProperty('hydra:next')) {
            dispatch(setNextProductsPage(hydraView['hydra:next']))
            dispatch(setHasMoreProducts(true))
          } else {
            // It means we have reached the last page
            dispatch(setHasMoreProducts(false))
          }
        } else {
          dispatch(setHasMoreProducts(false))
        }

        dispatch(loadProductsSuccess(res['hydra:member']))

      })
      .catch(e => dispatch(loadProductsFailure(e)))
  }
}

export function loadMoreProducts() {

  return function (dispatch, getState) {

    const { httpClient } = getState().app
    const { nextProductsPage, hasMoreProducts } = getState().restaurant

    if (!hasMoreProducts) {
      return
    }

    dispatch(loadProductsRequest())

    return httpClient.get(nextProductsPage)
      .then(res => {

        const hydraView = res['hydra:view']

        if (hydraView.hasOwnProperty('hydra:next')) {
          dispatch(setNextProductsPage(res['hydra:view']['hydra:next']))
          dispatch(setHasMoreProducts(true))
        } else {
          // It means we have reached the last page
          dispatch(setHasMoreProducts(false))
        }

        dispatch(loadMoreProductsSuccess(res['hydra:member']))
      })
      .catch(e => dispatch(loadProductsFailure(e)))
  }
}

export function changeProductEnabled(client, product, enabled) {

  return function (dispatch) {
    dispatch(changeProductEnabledRequest(product, enabled))

    return client.put(product['@id'], { enabled })
      .then(res => dispatch(changeProductEnabledSuccess(res)))
      .catch(e => dispatch(changeProductEnabledFailure(e, product, !enabled)))
  }
}

export function closeRestaurant(restaurant) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(closeRestaurantRequest())

    return httpClient.put(`${restaurant['@id']}/close`, {})
      .then(res => dispatch(closeRestaurantSuccess(res)))
      .catch(e => dispatch(closeRestaurantFailure(e)))
  }
}

export function deleteOpeningHoursSpecification(openingHoursSpecification) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(deleteOpeningHoursSpecificationRequest())

    return httpClient.delete(openingHoursSpecification['@id'])
      .then(res => dispatch(deleteOpeningHoursSpecificationSuccess(openingHoursSpecification)))
      .catch(e => dispatch(deleteOpeningHoursSpecificationFailure(e)))
  }
}

function bluetoothErrorToString(e) {
  if (typeof e === 'string') {
    return e
  }

  return e.message ? e.message : (e.toString && typeof e.toString === 'function' ? e.toString() : e)
}

export function printOrder(order) {

  return async (dispatch, getState) => {

    const { printer } = getState().restaurant

    if (!printer) {
      return
    }

    try {

      const isPeripheralConnected = await BleManager.isPeripheralConnected(printer.id, [])

      // Try to reconnect first
      if (!isPeripheralConnected) {
        try {
          await BleManager.connect(printer.id)
        } catch (e) {
          dispatch(printerDisconnected())
          DropdownHolder
            .getDropdown()
            .alertWithType(
              'error',
              i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
              bluetoothErrorToString(e)
            )
          return
        }
      }

      const peripheralInfo = await BleManager.retrieveServices(printer.id)

      // We keep only writable characteristics

      const writableCharacteristics = _.filter(peripheralInfo.characteristics, (characteristic) => {

        if (!characteristic.properties) {
          return false
        }

        // iOS
        if (Array.isArray(characteristic.properties)) {
          return _.includes(characteristic.properties, 'WriteWithoutResponse')
        }

        // Android
        return characteristic.properties.WriteWithoutResponse
      })

      if (writableCharacteristics.length > 0) {

        const encoded = encodeForPrinter(order)

        writableCharacteristics.sort((a, b) => {

          if (peripheralInfo.advertising.serviceUUIDs) {
            const isAdvertisedA = _.includes(peripheralInfo.advertising.serviceUUIDs, a.service)
            const isAdvertisedB = _.includes(peripheralInfo.advertising.serviceUUIDs, b.service)
            if (isAdvertisedA !== isAdvertisedB) {
              if (isAdvertisedA && !isAdvertisedB) {
                return -1
              }
              if (isAdvertisedB && !isAdvertisedA) {
                return 1
              }
            }
          }

          if (a.service.length === b.service.length) {
            return 0
          }

          return a.service.length > b.service.length ? -1 : 1
        })

        for (let i = 0; i < writableCharacteristics.length; i++) {

          const writableCharacteristic = writableCharacteristics[i]

          try {

            await BleManager.writeWithoutResponse(
              printer.id,
              writableCharacteristic.service,
              writableCharacteristic.characteristic,
              Array.from(encoded)
            )

            break

          } catch (e) {
            console.log('Write failed', e)
          }
        }
      }

    } catch (e) {
      DropdownHolder
        .getDropdown()
        .alertWithType(
          'error',
          i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
          bluetoothErrorToString(e)
        )
    }
  }
}

export function connectPrinter(device, cb) {

  return function (dispatch, getState) {
    BleManager.connect(device.id)
      .then(() => {

        dispatch(printerConnected(device))

        DropdownHolder
          .getDropdown()
          .alertWithType(
            'success',
            i18n.t('RESTAURANT_PRINTER_CONNECTED_TITLE'),
            i18n.t('RESTAURANT_PRINTER_CONNECTED_BODY', { name: (device.name || device.id) })
          )

        cb && cb()

      })
      .catch(e => {
        DropdownHolder
          .getDropdown()
          .alertWithType(
            'error',
            i18n.t('RESTAURANT_PRINTER_CONNECT_ERROR_TITLE'),
            bluetoothErrorToString(e)
          )
      })
  }
}

export function disconnectPrinter(device, cb) {

  return function (dispatch, getState) {
    BleManager.disconnect(device.id)
      .then(() => {

        dispatch(printerDisconnected())

        DropdownHolder
          .getDropdown()
          .alertWithType(
            'success',
            i18n.t('RESTAURANT_PRINTER_DISCONNECTED_TITLE'),
            i18n.t('RESTAURANT_PRINTER_DISCONNECTED_BODY', { name: (device.name || device.id) })
          )

        cb && cb()

      })
      .catch(e => {
        console.log(e)
      })
  }
}

export function loadProductOptions(restaurant) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(loadProductsRequest())

    return httpClient.get(`${restaurant['@id']}/product_options`)
      .then(res => {
        dispatch(loadProductOptionsSuccess(res['hydra:member']))
      })
      .catch(e => dispatch(loadProductsFailure(e)))
  }
}

export function changeProductOptionValueEnabled(productOptionValue, enabled) {

  return function (dispatch, getState) {

    const { app } = getState()
    const { httpClient } = app

    dispatch(changeProductOptionValueEnabledRequest(productOptionValue, enabled))

    httpClient.put(productOptionValue['@id'], { enabled })
      .then(res => dispatch(changeProductOptionValueEnabledSuccess(productOptionValue, res.enabled)))
      .catch(e => dispatch(changeProductOptionValueEnabledSuccess(e, productOptionValue, !enabled)))
  }
}
