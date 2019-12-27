import { createAction } from 'redux-actions'
import { StackActions, NavigationActions } from 'react-navigation'
import Stripe from 'tipsi-stripe'
import _ from 'lodash'

import NavigationHolder from '../../NavigationHolder'
import Settings from '../../Settings'

/*
 * Action Types
 */

export const REMOVE_ITEM = 'REMOVE_ITEM'
export const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY'

export const SET_ADDRESS = '@checkout/SET_ADDRESS'
export const SET_ADDRESS_OK = '@checkout/SET_ADDRESS_OK'
export const SET_DATE = '@checkout/SET_DATE'
export const SET_TIMING = '@checkout/SET_TIMING'
export const SET_CART_VALIDATION = '@checkout/SET_CART_VALIDATION'
export const CLEAR = '@checkout/CLEAR'
export const RESET_RESTAURANT = '@checkout/RESET_RESTAURANT'

export const INIT_REQUEST = '@checkout/INIT_REQUEST'
export const INIT_SUCCESS = '@checkout/INIT_SUCCESS'
export const INIT_FAILURE = '@checkout/INIT_FAILURE'

export const LOAD_RESTAURANTS_REQUEST = '@checkout/LOAD_RESTAURANTS_REQUEST'
export const LOAD_RESTAURANTS_SUCCESS = '@checkout/LOAD_RESTAURANTS_SUCCESS'
export const LOAD_RESTAURANTS_FAILURE = '@checkout/LOAD_RESTAURANTS_FAILURE'

export const CHECKOUT_REQUEST = '@checkout/CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = '@checkout/CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = '@checkout/CHECKOUT_FAILURE'

export const SHOW_ADDRESS_MODAL = '@checkout/SHOW_ADDRESS_MODAL'
export const HIDE_ADDRESS_MODAL = '@checkout/HIDE_ADDRESS_MODAL'

export const UPDATE_CART_SUCCESS = '@checkout/UPDATE_CART_SUCCESS'

export const SET_CHECKOUT_LOADING = '@checkout/SET_CHECKOUT_LOADING'

export const ADD_ITEM_REQUEST = '@checkout/ADD_ITEM_REQUEST'
export const ADD_ITEM_REQUEST_FINISHED = '@checkout/ADD_ITEM_REQUEST_FINISHED'

/*
 * Action Creators
 */

export const setDate = createAction(SET_DATE)
export const clear = createAction(CLEAR)
export const setAddressOK = createAction(SET_ADDRESS_OK)
export const setTiming = createAction(SET_TIMING)
export const setCartValidation = createAction(SET_CART_VALIDATION, (isValid, violations = []) => ({ isValid, violations }))

export const initRequest = createAction(INIT_REQUEST)
export const initSuccess = createAction(INIT_SUCCESS, (cart, token, restaurant = null) => ({ cart, token, restaurant }))
export const initFailure = createAction(INIT_FAILURE)
export const resetRestaurant = createAction(RESET_RESTAURANT)

export const loadRestaurantsRequest = createAction(LOAD_RESTAURANTS_REQUEST)
export const loadRestaurantsSuccess = createAction(LOAD_RESTAURANTS_SUCCESS)
export const loadRestaurantsFailure = createAction(LOAD_RESTAURANTS_FAILURE)

export const checkoutRequest = createAction(CHECKOUT_REQUEST)
export const checkoutSuccess = createAction(CHECKOUT_SUCCESS)
export const checkoutFailure = createAction(CHECKOUT_FAILURE)

export const showAddressModal = createAction(SHOW_ADDRESS_MODAL)
export const hideAddressModal = createAction(HIDE_ADDRESS_MODAL)

export const updateCartSuccess = createAction(UPDATE_CART_SUCCESS)

export const setCheckoutLoading = createAction(SET_CHECKOUT_LOADING)

export const addItemRequest = createAction(ADD_ITEM_REQUEST)
export const addItemRequestFinished = createAction(ADD_ITEM_REQUEST_FINISHED)

export const removeItemRequest = createAction(REMOVE_ITEM)

function validateAddress(httpClient, cart, address) {
  const latitude = address.geo.latitude
  const longitude = address.geo.longitude

  return httpClient.get(`${cart.restaurant}/can-deliver/${latitude},${longitude}`)
}

function createHttpClient(state) {
  const { httpClient } = state.app
  if (httpClient.model && httpClient.model.token && httpClient.model.refreshToken) {
    return httpClient
  }

  const { token } = state.checkout

  return httpClient.cloneWithModel({ token })
}

let setAddressListener = null

function setSetAddressListener(cb) {
  setAddressListener = cb
}

function onSetAddress(address) {
  if (setAddressListener && typeof setAddressListener === 'function') {
    setAddressListener(address)
  }
  setAddressListener = null
}

// This action may be dispatched several times "recursively"
export function addItem(item, options = []) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { address, cart, isAddressOK } = getState().checkout

    if (!address || !isAddressOK) {

      // We don't have an adress
      // Stop here an ask for address
      if (!address) {
        // When the address is set,
        // re-dispatch the same action
        setSetAddressListener(() => {
          dispatch(addItem(item, options))
        })
        dispatch(showAddressModal())
        return
      }

      // When isAddressOK === null,
      // it means we have an address, but it hasn't been validated yet
      if (isAddressOK === null) {
        validateAddress(httpClient, cart, address)
          // When the address is valid,
          // re-dispatch the same action
          .then(() => {
            dispatch(_setAddress(address))
            dispatch(setAddressOK(true))
            dispatch(addItem(item, options))
          })
          .catch(() => {
            dispatch(setAddressOK(false))
            setSetAddressListener(() => {
              dispatch(addItem(item, options))
            })
            dispatch(showAddressModal())
          })

        return
      }

      dispatch(showAddressModal())
      return
    }

    if (item.hasOwnProperty('menuAddOn') && Array.isArray(item.menuAddOn) && item.menuAddOn.length > 0
      && options.length === 0) {
      NavigationHolder.navigate('CheckoutProductOptions', { product: item })
      return
    }

    dispatch(addItemRequest(item))
    dispatch(queueAddItem(item, options))
  }
}

function queueAddItem(item, options = []) {

  return {
    queue: 'ADD_ITEM',
    callback: (next, dispatch, getState) => {

      const { cart, token } = getState().checkout
      const httpClient = createHttpClient(getState())

      dispatch(setCheckoutLoading(true))

      httpClient
        .post(`${cart['@id']}/items`, {
          product: item.identifier,
          options: _.map(options, o => o.identifier),
        })
        .then(res => {
          dispatch(updateCartSuccess(res))
          dispatch(setCheckoutLoading(false))
          dispatch(addItemRequestFinished(item))
        })
        .catch(e => {
          console.log(e)
          dispatch(setCheckoutLoading(false))
          dispatch(addItemRequestFinished(item))
        })
        .finally(next)
    },
  }
}

export function addItemWithOptions(item, options = []) {
  return addItem(item, options)
}

const fetchValidation = _.throttle((dispatch, getState) => {

  const httpClient = createHttpClient(getState())
  const { cart } = getState().checkout

  // No need to validate when cart is empty
  if (cart.items.length === 0) {
    return
  }

  const doTiming = () => new Promise((resolve) => {
    httpClient
      .get(`${cart['@id']}/timing`)
      .then(timing => dispatch(setTiming(timing)))
      // .catch(error => dispatch(setCartValidation(false, error.violations)))
      .finally(resolve)
  })

  const doValidate = () => new Promise((resolve) => {
    httpClient
      .get(`${cart['@id']}/validate`)
      .then(() => dispatch(setCartValidation(true)))
      .catch(error => dispatch(setCartValidation(false, error.violations)))
      .finally(resolve)
  })

  dispatch(setCheckoutLoading(true))

  Promise.all([ doTiming(), doValidate() ])
    .then(() => dispatch(setCheckoutLoading(false)))

}, 500)

const updateItemQuantity = createAction(UPDATE_ITEM_QUANTITY, (item, quantity) => ({ item, quantity }))

function syncItem(item) {

  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {

      const httpClient = createHttpClient(getState())
      const { cart } = getState().checkout

      // We make sure to get item from state,
      // because it may have been updated
      const itemFromState = _.find(cart.items, it => it.id === item.id)
      if (!itemFromState) {
        next()
        return
      }

      dispatch(setCheckoutLoading(true))

      httpClient
        // FIXME We should have the "@id" property
        .put(`${cart['@id']}/items/${item.id}`, {
          quantity: itemFromState.quantity,
        })
        .then(res => {
          dispatch(updateCartSuccess(res))
          dispatch(setCheckoutLoading(false))

          fetchValidation.cancel()
          fetchValidation(dispatch, getState)
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false))
        })
        .finally(next)
    },
  }
}

const syncItemDebounced = _.debounce((dispatch, item) => dispatch(syncItem(item)), 350)

export function incrementItem(item) {

  return (dispatch, getState) => {
    const quantity = item.quantity + 1
    // Dispatch an action to "virtually" change the item quantity,
    // so that the user has a UI feedback
    dispatch(updateItemQuantity(item, quantity))
    syncItemDebounced(dispatch, item)
  }
}

export function decrementItem(item) {

  return (dispatch, getState) => {
    const quantity = item.quantity - 1
    // Dispatch an action to "virtually" change the item quantity,
    // so that the user has a UI feedback
    dispatch(updateItemQuantity(item, quantity))
    syncItemDebounced(dispatch, item)
  }
}

function queueRemoveItem(item) {

  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {

      const httpClient = createHttpClient(getState())
      const { cart } = getState().checkout

      dispatch(setCheckoutLoading(true))

      httpClient
        // FIXME We should have the "@id" property
        .delete(`${cart['@id']}/items/${item.id}`)
        .then(res => {
          dispatch(updateCartSuccess(res))
          dispatch(setCheckoutLoading(false))

          fetchValidation.cancel()
          fetchValidation(dispatch, getState)
        })
        .catch(e => {
          dispatch(setCheckoutLoading(false))
        })
        .finally(next)
    },
  }
}

export function removeItem(item) {

  return (dispatch, getState) => {
    // Dispatch an action to "virtually" remove the item,
    // so that the user has a UI feedback
    dispatch(removeItemRequest(item))

    dispatch(queueRemoveItem(item))
  }
}

export function validate() {

  return (dispatch, getState) => {
    setSetAddressListener(() => {
      fetchValidation(dispatch, getState)
    })
    dispatch(syncAddress())
  }
}

const _setAddress = createAction(SET_ADDRESS)

function syncAddress() {

  return {
    queue: 'UPDATE_CART',
    callback: (next, dispatch, getState) => {

      const httpClient = createHttpClient(getState())
      const { address, cart } = getState().checkout

      dispatch(setCheckoutLoading(true))

      httpClient.put(cart['@id'], { shippingAddress: address })
        .then(res => {
          dispatch(updateCartSuccess(res))
          dispatch(setCheckoutLoading(false))
          dispatch(hideAddressModal())
          onSetAddress(address)
        })
        .finally(next)
    }
  }
}

export function setAddress(address) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { cart } = getState().checkout

    if (cart.restaurant) {

      dispatch(setCheckoutLoading(true))

      validateAddress(httpClient, cart, address)
        .then(() => {
          dispatch(_setAddress(address))
          dispatch(setAddressOK(true))
          dispatch(syncAddress())
        })
        .catch(() => {
          dispatch(setAddressOK(false))
          dispatch(setCheckoutLoading(false))
        })
      }
  }
}

export function searchRestaurantsForAddress(address, options = {}) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    let queryString = `coordinate=${address.geo.latitude},${address.geo.longitude}`
    dispatch(loadRestaurantsRequest())

    httpClient.get('/api/restaurants' + (queryString ? `?${queryString}` : ''))
      .then(res => {
        dispatch(_setAddress(address))
        dispatch(loadRestaurantsSuccess(res['hydra:member']))
      })
      .catch(e => dispatch(loadRestaurantsFailure(e)))
  }
}

export function searchRestaurants(options = {}) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    let queryString = ''
    if (options && options.hasOwnProperty('latitude') && options.hasOwnProperty('longitude')) {
      queryString = `coordinate=${options.latitude},${options.longitude}`
    }

    dispatch(loadRestaurantsRequest())

    httpClient.get('/api/restaurants' + (queryString ? `?${queryString}` : ''))
      .then(res => dispatch(loadRestaurantsSuccess(res['hydra:member'])))
      .catch(e => dispatch(loadRestaurantsFailure(e)))
  }
}

export function init(restaurant) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app

    dispatch(initRequest(restaurant))

    const reqs = []

    reqs.push(httpClient.post('/api/carts/session', {
      restaurant: restaurant['@id'],
    }))

    if (typeof restaurant.hasMenu === 'string') {
      reqs.push(httpClient.get(restaurant.hasMenu))
    }

    Promise.all(reqs)
      .then(values => {
        const session = values[0]

        const args = [
          session.cart,
          session.token,
        ]

        if (values.length === 2) {
          const menu = values[1]
          const restaurantWithMenu = {
            ...restaurant,
            hasMenu: menu
          }
          args.push(restaurantWithMenu)
        }

        dispatch(initSuccess(...args))
      })
  }
}

export function checkout(number, expMonth, expYear, cvc) {

  return (dispatch, getState) => {

    const { httpClient } = getState().app
    const { cart } = getState().checkout

    Stripe.setOptions({
      publishableKey: Settings.get('stripe_publishable_key'),
    })

    dispatch(checkoutRequest())

    Stripe.createTokenWithCard({
      number,
      expMonth: parseInt(expMonth, 10),
      expYear: parseInt(expYear, 10),
      cvc,
    })
    .then(token => {
      httpClient
        .put(cart['@id'] + '/pay', { stripeToken: token.tokenId })
        .then(order => {

          // First, reset checkout stack
          NavigationHolder.dispatch(StackActions.popToTop())
          // Then, navigate to order screen
          NavigationHolder.dispatch(NavigationActions.navigate({
            routeName: 'AccountNav',
            // We skip the AccountOrders screen
            action: NavigationActions.navigate({
              routeName: 'AccountOrder',
              params: { order },
            }),
          }))

          // Make sure to clear AFTER navigation has been reset
          dispatch(clear())
          dispatch(checkoutSuccess(order))

        })
        .catch(e => dispatch(checkoutFailure(e)))
    })
    .catch(err => console.log(err));

  }
}
