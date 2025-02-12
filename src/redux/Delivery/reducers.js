import _ from 'lodash';

import {
  ASSERT_DELIVERY_ERROR,
  GET_PRICE_ERROR,
  GET_PRICE_SUCCESS,
  LOAD_ADDRESSES_SUCCESS,
  LOAD_TIME_SLOTS_SUCCESS,
  LOAD_TIME_SLOT_CHOICES_SUCCESS,
  SET_RETURN_SCREEN,
  SET_STORE
} from "./actions"
import { formatPrice } from '../../utils/formatting';


const initialState = {
  addresses: [],
  assertDeliveryError: null,
  timeSlotChoices: [],
  price: null,
  priceExcludingTax: null,
  returnScreen: '',
  store: null,
  timeSlots: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
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

    case LOAD_ADDRESSES_SUCCESS:
      if (action.payload.store['@id'] === state.store['@id']) {
        return {
          ...state,
          addresses: _.uniqBy(action.payload.addresses, '@id'),
        };
      }

      break;

    case LOAD_TIME_SLOTS_SUCCESS:
      return {
        ...state,
        timeSlots: action.payload,
      };

    case LOAD_TIME_SLOT_CHOICES_SUCCESS:
      return {
        ...state,
        timeSlotChoices: action.payload,
      };

    case SET_RETURN_SCREEN:
      return {
        ...state,
        returnScreen: action.payload,
      };

    case SET_STORE:
      return {
        ...state,
        store: action.payload,
      }
  }

  return state;
}
