import { createAction } from 'redux-actions'

import { setLoading } from '../App/actions'

/*
 * Action Types
 */

export const LOAD_ORDERS_REQUEST = '@account/LOAD_ORDERS_REQUEST'
export const LOAD_ORDERS_SUCCESS = '@account/LOAD_ORDERS_SUCCESS'
export const LOAD_ORDERS_FAILURE = '@account/LOAD_ORDERS_FAILURE'

export const LOAD_ADDRESSES_SUCCESS = '@account/LOAD_ADDRESSES_SUCCESS'

/*
 * Action Creators
 */

export const loadOrdersRequest = createAction(LOAD_ORDERS_REQUEST)
export const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
export const loadOrdersFailure = createAction(LOAD_ORDERS_FAILURE)

const loadAddressesSuccess = createAction(LOAD_ADDRESSES_SUCCESS)

export function init() {
  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient
    const initialized = getState().account.initialized

    if (!initialized) {

      dispatch(loadOrdersRequest())
      httpClient.get('/api/me/orders')
        .then(res => {
          dispatch(loadOrdersSuccess(res['hydra:member']))
        })
    }
  }
}

export function loadAddresses() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(setLoading(true))

    httpClient.get('/api/me')
      .then(res => {
        dispatch(loadAddressesSuccess(res.addresses,))
        dispatch(setLoading(false))
      })
      .catch(e => {
        console.log(e)
        dispatch(setLoading(false))
      })
  }
}
