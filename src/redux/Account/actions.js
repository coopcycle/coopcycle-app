import { createAction } from 'redux-actions'

/*
 * Action Types
 */

export const LOAD_ORDERS_REQUEST = '@account/LOAD_ORDERS_REQUEST'
export const LOAD_ORDERS_SUCCESS = '@account/LOAD_ORDERS_SUCCESS'
export const LOAD_ORDERS_FAILURE = '@account/LOAD_ORDERS_FAILURE'

/*
 * Action Creators
 */

export const loadOrdersRequest = createAction(LOAD_ORDERS_REQUEST)
export const loadOrdersSuccess = createAction(LOAD_ORDERS_SUCCESS)
export const loadOrdersFailure = createAction(LOAD_ORDERS_FAILURE)

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
