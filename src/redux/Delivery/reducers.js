import _ from 'lodash';

import {
  ASSERT_DELIVERY_ERROR,
  LOAD_ADDRESSES_SUCCESS,
  SET_RETURN_SCREEN
} from "./actions"


const initialState = {
  addresses: [],
  assertDeliveryError: null,
  returnScreen: '',
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_RETURN_SCREEN:
      return {
        ...state,
        returnScreen: action.payload,
      };

    case ASSERT_DELIVERY_ERROR:
      return {
        ...state,
        assertDeliveryError: action.payload,
      };

    case LOAD_ADDRESSES_SUCCESS:
      if (action.payload.store['@id'] === state.store['@id']) {
        return {
          ...state,
          addresses: _.uniqBy(action.payload.addresses, '@id'),
        };
      }

      break;
  }

  return state;
}
