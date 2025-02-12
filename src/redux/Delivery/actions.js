import _ from 'lodash';
import { createAction } from "@reduxjs/toolkit";

import { setLoading } from '../App/actions';
import { selectTimeSlots } from "./selectors";


export const SET_RETURN_SCREEN = '@delivery/SET_RETURN_SCREEN';

export const ASSERT_DELIVERY_ERROR = '@delivery/ASSERT_DELIVERY_ERROR';

export const LOAD_ADDRESSES_SUCCESS = '@delivery/LOAD_ADDRESSES_SUCCESS';

export const LOAD_TIME_SLOTS_SUCCESS = '@delivery/LOAD_TIME_SLOTS_SUCCESS';
export const LOAD_TIME_SLOT_SUCCESS = '@delivery/LOAD_TIME_SLOT_SUCCESS';
export const LOAD_TIME_SLOT_CHOICES_SUCCESS = '@delivery/LOAD_TIME_SLOT_CHOICES_SUCCESS';

export const SET_REFRESHING = '@delivery/SET_REFRESHING';

export const SET_STORE = '@delivery/SET_STORE';


export const GET_PRICE_SUCCESS = '@delivery/GET_PRICE_SUCCESS';
export const GET_PRICE_ERROR = '@delivery/GET_PRICE_ERROR';


export const setReturnScreen = createAction(SET_RETURN_SCREEN);

export const assertDeliveryError = createAction(ASSERT_DELIVERY_ERROR);

export const setRefreshing = createAction(SET_REFRESHING);

export const setStore = createAction(SET_STORE);

const getPriceSuccess = createAction(GET_PRICE_SUCCESS);
const getPriceError = createAction(GET_PRICE_ERROR);

const loadTimeSlotsSuccess = createAction(LOAD_TIME_SLOTS_SUCCESS);
const loadTimeSlotSuccess = createAction(LOAD_TIME_SLOT_SUCCESS);
export const loadTimeSlotChoicesSuccess = createAction(LOAD_TIME_SLOT_CHOICES_SUCCESS);


const loadAddressesSuccess = createAction(
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



export function loadTimeSlots(store) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(setLoading(true));

    return httpClient
      .get(`${store['@id']}/time_slots`)
      .then(res => {
        dispatch(loadTimeSlotsSuccess(res['hydra:member']));
        dispatch(setLoading(false));
        // dispatch(loadTimeSlotChoices(res['hydra:member'][0]));
      })
      .catch(e => {
        dispatch(setLoading(false));
      });
  };
}


export function loadTimeSlotChoices(timeSlot) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(setLoading(true));

    return httpClient
      .get(`${timeSlot['@id']}/choices`)
      .then(res => {
        dispatch(loadTimeSlotChoicesSuccess(res.choices));
        dispatch(setLoading(false));
      })
      .catch(e => {
        dispatch(setLoading(false));
      });
  };
}

export function loadTimeSlot(store) {
  return (dispatch, getState) => {
    if (!store.timeSlot) {
      return;
    }

    const { app } = getState();
    const { httpClient } = app;

    const timeSlot = _.find(
      selectTimeSlots(getState()),
      ts => ts['@id'] === store.timeSlot,
    );
    if (timeSlot) {
      return;
    }

    dispatch(setLoading(true));

    return httpClient
      .get(store.timeSlot)
      .then(res => {
        dispatch(setLoading(false));
        dispatch(loadTimeSlotSuccess(res));
      })
      .catch(e => {
        dispatch(setLoading(false));
      });
  };
}


export function getPrice(delivery) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(setLoading(true));

    return httpClient
      .post(`/api/retail_prices/calculate`, delivery)
      .then(res => {
        dispatch(getPriceSuccess(res));
        dispatch(setLoading(false));
      })
      .catch(e => {
        dispatch(getPriceError(e));
        dispatch(setLoading(false));
      });
  };
}