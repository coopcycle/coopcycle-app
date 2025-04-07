import {
  CHANGE_DATE,
  CREATE_TOUR_SUCCESS,
  UPDATE_TOUR_SUCCESS,
} from "../Dispatch/actions";
import {
  DELETE_TOUR_SUCCESS,
  LOAD_TOURS_SUCCESS,
  UPDATE_TOUR,
  tourAdapter,
} from "../../shared/logistics/redux";


const initialState = tourAdapter.getInitialState()

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return initialState;

    case LOAD_TOURS_SUCCESS:
      return tourAdapter.upsertMany(state, action.payload);

    case CREATE_TOUR_SUCCESS:
    case UPDATE_TOUR:
    case UPDATE_TOUR_SUCCESS:
      return tourAdapter.upsertOne(state, action.payload);

    case DELETE_TOUR_SUCCESS:
      return tourAdapter.removeOne(state, action.payload);

    default:
      return state;
  }
}
