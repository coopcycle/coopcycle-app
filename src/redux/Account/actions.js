import { createAction } from 'redux-actions'

import { setLoading } from '../App/actions'

/*
 * Action Types
 */

export const LOAD_ORDERS_SUCCESS = '@account/LOAD_ORDERS_SUCCESS'
export const LOAD_ADDRESSES_SUCCESS = '@account/LOAD_ADDRESSES_SUCCESS'
export const LOAD_PERSONAL_INFO_SUCCESS = '@account/LOAD_PERSONAL_INFO_SUCCESS'

/*
 * Action Creators
 */

const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
const loadAddressesSuccess = createAction(LOAD_ADDRESSES_SUCCESS)
const loadPersonalInfoSuccess = createAction(LOAD_PERSONAL_INFO_SUCCESS)

export function loadOrders() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient
    dispatch(setLoading(true))

    httpClient.get('/api/me/orders')
      .then(res => {
        dispatch(loadOrdersSuccess(res['hydra:member']))
        dispatch(setLoading(false))
      })
      .catch(e => {
        console.log(e)
        dispatch(setLoading(false))
      })
  }
}

export function loadAddresses() {

  return function (dispatch, getState) {

    const httpClient = getState().app.httpClient

    dispatch(setLoading(true))

    httpClient.get('/api/me')
      .then(res => {
        dispatch(loadAddressesSuccess(res.addresses))
        dispatch(setLoading(false))
      })
      .catch(e => {
        console.log(e)
        dispatch(setLoading(false))
      })
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
