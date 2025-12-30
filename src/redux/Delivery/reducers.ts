import { PayloadAction, Reducer } from '@reduxjs/toolkit';

import {
  ASSERT_DELIVERY_ERROR,
  GET_PRICE_ERROR,
  GET_PRICE_SUCCESS,
  LOAD_TIME_SLOTS_SUCCESS,
  SET_STORE,
  SET_STORES,
} from './actions';
import { formatPrice } from '../../utils/formatting';
import { LOGOUT_SUCCESS } from '../App/actions';
import { Store, TimeSlot } from '@/src/redux/api/types';

type DeliveryState = {
  assertDeliveryError;
  price: string | null;
  priceExcludingTax: string | null;
  store: Store | null;
  stores: Store[];
  timeSlots: TimeSlot[];
};

const initialState: DeliveryState = {
  assertDeliveryError: null,
  price: null,
  priceExcludingTax: null,
  store: null,
  stores: [],
  timeSlots: [],
};

const reducer: Reducer<DeliveryState, PayloadAction<unknown>> = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGOUT_SUCCESS:
      return initialState;

    case ASSERT_DELIVERY_ERROR:
      return {
        ...state,
        assertDeliveryError: action.payload,
      };

    case GET_PRICE_SUCCESS:
      const { amount, tax } = action.payload;

      return {
        ...state,
        price: formatPrice(amount),
        priceExcludingTax: formatPrice(amount - tax.amount),
      };

    case GET_PRICE_ERROR:
      return {
        ...state,
        price: null,
        priceExcludingTax: null,
      };

    case LOAD_TIME_SLOTS_SUCCESS:
      return {
        ...state,
        timeSlots: action.payload as TimeSlot[],
      };

    case SET_STORE:
      return {
        ...state,
        store: action.payload as Store,
      };

    case SET_STORES:
      return {
        ...state,
        stores: action.payload as Store[],
      };
  }

  return state;
};

export default reducer;
