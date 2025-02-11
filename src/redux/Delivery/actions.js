import { createAction } from "@reduxjs/toolkit";

import { setLoading } from '../App/actions';


export const SET_RETURN_SCREEN = '@delivery/SET_RETURN_SCREEN';

export const ASSERT_DELIVERY_ERROR = '@delivery/ASSERT_DELIVERY_ERROR';

export const setReturnScreen = createAction(SET_RETURN_SCREEN);

export const assertDeliveryError = createAction(ASSERT_DELIVERY_ERROR);

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
