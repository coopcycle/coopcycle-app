import {
  ASSERT_DELIVERY_ERROR,
  SET_RETURN_SCREEN
} from "./actions"

const initialState = {
  returnScreen: '',
  assertDeliveryError: null,
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
  }

  return state;
}
