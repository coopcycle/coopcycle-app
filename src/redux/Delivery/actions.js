import { createAction } from "@reduxjs/toolkit";

import { setLoading } from '../App/actions';


export const SET_RETURN_SCREEN = '@delivery/SET_RETURN_SCREEN';

export const ASSERT_DELIVERY_ERROR = '@delivery/ASSERT_DELIVERY_ERROR';

export const LOAD_ADDRESSES_SUCCESS = '@delivery/LOAD_ADDRESSES_SUCCESS';

export const SET_REFRESHING = '@delivery/SET_REFRESHING';

export const SET_STORE = '@delivery/SET_STORE';


export const setReturnScreen = createAction(SET_RETURN_SCREEN);

export const assertDeliveryError = createAction(ASSERT_DELIVERY_ERROR);

export const setRefreshing = createAction(SET_REFRESHING);

export const setStore = createAction(SET_STORE);

export const loadAddressesSuccess = createAction(
  LOAD_ADDRESSES_SUCCESS,
  (store, addresses) => ({
    payload: {
        store,
        addresses,
    }
  }),
);


export function assertDelivery(delivery, onSuccess) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(assertDeliveryError(null));
    dispatch(setLoading(true));

    httpClient
      .post('/api/deliveries/assert', delivery)
      .then(res => {
        dispatch(setLoading(false));
        onSuccess();
      })
      .catch(e => {
        dispatch(setLoading(false));
        dispatch(assertDeliveryError(e['hydra:description']));
      });
  };
}


export function loadAddresses(store) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    return httpClient
      .get(`${store['@id']}/addresses`)
      .then(res => {
        dispatch(loadAddressesSuccess(store, res['hydra:member']));
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      })
      .catch(e => {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      });
  };
}

