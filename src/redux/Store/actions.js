import { createAction } from 'redux-actions'
import _ from 'lodash'

import { setLoading } from '../App/actions'
import { selectTimeSlots } from './selectors'

export const LOAD_MY_STORES_SUCCESS = '@store/LOAD_MY_STORES_SUCCESS'
export const LOAD_MY_STORES_FAILURE = '@store/LOAD_MY_STORES_FAILURE'

export const LOAD_DELIVERIES_SUCCESS = '@store/LOAD_DELIVERIES_SUCCESS'
export const CREATE_DELIVERY_SUCCESS = '@store/CREATE_DELIVERY_SUCCESS'
export const LOAD_TIME_SLOT_SUCCESS = '@store/LOAD_TIME_SLOT_SUCCESS'

export const LOAD_DELIVERY_SUCCESS = '@store/LOAD_DELIVERY_SUCCESS'
export const CLEAR_DELIVERY = '@store/CLEAR_DELIVERY'
export const ASSERT_DELIVERY_ERROR = '@store/ASSERT_DELIVERY_ERROR'

export const loadMyStoresSuccess = createAction(LOAD_MY_STORES_SUCCESS)

export const createDeliverySuccess = createAction(CREATE_DELIVERY_SUCCESS)

export const loadStoreDeliveriesSuccess = createAction(LOAD_DELIVERIES_SUCCESS, (store, deliveries) => ({ store, deliveries }))
export const loadTimeSlotSuccess = createAction(LOAD_TIME_SLOT_SUCCESS)

export const loadDeliverySuccess = createAction(LOAD_DELIVERY_SUCCESS)
export const clearDelivery = createAction(CLEAR_DELIVERY)

export const assertDeliveryError = createAction(ASSERT_DELIVERY_ERROR)

export function createDelivery(delivery, onSuccess) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(setLoading(true))

    httpClient.post('/api/deliveries', delivery)
      .then(res => {
        dispatch(createDeliverySuccess(res))
        dispatch(setLoading(false))
        onSuccess()
      })
      .catch(e => {
        dispatch(setLoading(false))
      })
  }
}

export function assertDelivery(delivery, onSuccess) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(assertDeliveryError(null))
    dispatch(setLoading(true))

    httpClient.post('/api/deliveries/assert', delivery)
      .then(res => {
        dispatch(setLoading(false))
        onSuccess()
      })
      .catch(e => {
        dispatch(setLoading(false))
        dispatch(assertDeliveryError(e['hydra:description']))
      })
  }
}

export function loadDeliveries(store) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(setLoading(true))

    return httpClient.get(`${store['@id']}/deliveries?order[dropoff.before]=desc`)
      .then(res => {
        dispatch(setLoading(false))
        dispatch(loadStoreDeliveriesSuccess(store, res['hydra:member']))
      })
      .catch(e => {
        dispatch(setLoading(false))
      })
  }
}

export function loadDelivery(delivery) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(setLoading(true))

    return httpClient.get(delivery['@id'])
      .then(res => {
        dispatch(setLoading(false))
        dispatch(loadDeliverySuccess(res))
      })
      .catch(e => {
        dispatch(setLoading(false))
      })
  }
}

export function loadTimeSlot(store) {

  return (dispatch, getState) => {

    if (!store.timeSlot) {
      return
    }

    const { app } = getState()
    const { httpClient } = app

    const timeSlot = _.find(selectTimeSlots(getState()), timeSlot => timeSlot['@id'] === store.timeSlot)
    if (timeSlot) {
      return
    }

    dispatch(setLoading(true))

    return httpClient.get(store.timeSlot)
      .then(res => {
        dispatch(setLoading(false))
        dispatch(loadTimeSlotSuccess(res))
      })
      .catch(e => {
        dispatch(setLoading(false))
      })
  }
}
