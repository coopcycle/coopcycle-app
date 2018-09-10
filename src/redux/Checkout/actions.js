import { createAction } from 'redux-actions'

/*
 * Action Types
 */
export const INIT = 'CHECKOUT_INIT'
export const ADD_ITEM = 'ADD_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const INCREMENT_ITEM = 'INCREMENT_ITEM'
export const DECREMENT_ITEM = 'DECREMENT_ITEM'
export const SET_ADDRESS_RESOURCE = 'SET_ADDRESS_RESOURCE'
export const CLEAR = 'CHECKOUT_CLEAR'

/*
 * Action Creators
 */
export const init = createAction(INIT, (restaurant, address, date) => ({ restaurant, address, date }))
export const addItem = createAction(ADD_ITEM, (item, options = []) => ({ item, options }))
export const removeItem = createAction(REMOVE_ITEM)
export const incrementItem = createAction(INCREMENT_ITEM)
export const decrementItem = createAction(DECREMENT_ITEM)
export const setAddressResource = createAction(SET_ADDRESS_RESOURCE)
export const clear = createAction(CLEAR)
