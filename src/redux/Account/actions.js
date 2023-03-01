import { createAction } from 'redux-actions'
import Centrifuge from 'centrifuge'
import parseUrl from 'url-parse'
import _ from 'lodash'

import { logout, setLoading } from '../App/actions'
import { selectHttpClient, selectIsAuthenticated } from '../App/selectors';

/*
 * Action Types
 */

export const LOAD_ORDERS_SUCCESS = '@account/LOAD_ORDERS_SUCCESS'
export const LOAD_ORDER_SUCCESS = '@account/LOAD_ORDER_SUCCESS'
export const UPDATE_ORDER_SUCCESS = '@account/UPDATE_ORDER_SUCCESS'
export const LOAD_ADDRESSES_SUCCESS = '@account/LOAD_ADDRESSES_SUCCESS'
export const LOAD_PERSONAL_INFO_SUCCESS = '@account/LOAD_PERSONAL_INFO_SUCCESS'

export const CONNECTED = '@account/CENTRIFUGO_CONNECTED'
export const DISCONNECTED = '@account/CENTRIFUGO_DISCONNECTED'

/*
 * Action Creators
 */

const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
const loadOrderSuccess = createAction(LOAD_ORDER_SUCCESS)
export const loadAddressesSuccess = createAction(LOAD_ADDRESSES_SUCCESS)
const loadPersonalInfoSuccess = createAction(LOAD_PERSONAL_INFO_SUCCESS)
export const updateOrderSuccess = createAction(UPDATE_ORDER_SUCCESS)

const connected = createAction(CONNECTED)
const disconnected = createAction(DISCONNECTED)

export function loadOrders(cb) {

  return function (dispatch, getState) {

    const httpClient = selectHttpClient(getState())

    httpClient.get('/api/me/orders')
      .then(res => {
        dispatch(loadOrdersSuccess(res['hydra:member']))
        if (cb) { cb() }
      })
      .catch(e => {
        if (cb) { cb(e) }
      })
  }
}

export function loadOrder(order, cb) {
  return (dispatch, getState) => {
    const httpClient = selectHttpClient(getState())

    httpClient.get(order['@id'])
      .then(res => {
        dispatch(updateOrderSuccess(res))
        if (cb) { cb() }
      })
      .catch(e => {
        if (cb) { cb(e) }
      })
  }
}


export function loadAddresses() {

  return function (dispatch, getState) {

    if (!selectIsAuthenticated(getState())) {
      return;
    }

    const httpClient = getState().app.httpClient


    httpClient.get('/api/me')
      .then(res => {
        dispatch(loadAddressesSuccess(res.addresses))
      })
  }
}

export function newAddress(address) {

  return function (dispatch, getState) {
    const { httpClient } = getState().app

    if (!_.has(address, 'isPrecise') || !address.isPrecise) {
      return;
    }

    if (selectIsAuthenticated(getState())) {
      httpClient.post('/api/me/addresses', address).then(res => {
        dispatch(loadAddressesSuccess([ res, ...getState().account.addresses ]))
      }).catch(console.log)
    } else {
      dispatch(loadAddressesSuccess([ address, ...getState().account.addresses ]))
    }

  }

}

export function loadPersonalInfo() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(setLoading(true))

    httpClient.get('/api/me')
      .then(res => {
        dispatch(loadPersonalInfoSuccess(res))
        dispatch(setLoading(false))
      })
      .catch(e => {
        console.log(e)
        dispatch(setLoading(false))
      })
  }
}

const callbacks = []

function addCallback(order, cb) {
  callbacks.push({
    order, cb,
  })
}

function applyCallback(order) {
  const callback = _.find(callbacks, (cb) => cb.order['@id'] === order['@id'])
  if (callback) {
    callback.cb()
    callbacks.splice(callbacks.indexOf(callback), 1)
  }
}

export function subscribe(order, onMessage) {

  return function (dispatch, getState) {

    const baseURL = getState().app.baseURL
    const httpClient = getState().app.httpClient

    httpClient.get(`${order['@id']}/centrifugo`)
      .then(res => {

        const url = parseUrl(baseURL)
        const protocol = url.protocol === 'https:' ? 'wss' : 'ws'

        const centrifuge = new Centrifuge(`${protocol}://${url.hostname}/centrifugo/connection/websocket`, {
          debug: __DEV__,
          onRefresh: function(ctx, cb) {
            // FIXME Implement refresh
          },
        })
        centrifuge.setToken(res.token)

        centrifuge.on('connect', context => dispatch(connected(context)))
        centrifuge.on('disconnect', context => dispatch(disconnected(context)))

        centrifuge.subscribe(res.channel, msg => onMessage(msg.data.event))

        centrifuge.connect()

        addCallback(order, () => centrifuge.disconnect())

        dispatch(setLoading(false))

      })
      .catch(e => dispatch(setLoading(false)))
  }
}

export function unsubscribe(order) {

  return function (dispatch, getState) {

    applyCallback(order)
  }
}

export function deleteUser() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(setLoading(true))

    httpClient.delete('/api/me')
      .then(res => {
        dispatch(logout())
        dispatch(setLoading(false))
      })
      .catch(e => {
        console.log(e)
        dispatch(setLoading(false))
      })
  }
}
