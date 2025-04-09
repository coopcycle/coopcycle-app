import {
  CREATE_TOUR_SUCCESS,
  UPDATE_TOUR_SUCCESS,
  changeDate,
} from "../Dispatch/actions";
import {
  DELETE_TOUR_SUCCESS,
  UPDATE_TOUR,
  loadToursSuccess,
  tourAdapter,
} from "../../shared/logistics/redux";
import { actionMatchCreator } from "../util";


const initialState = tourAdapter.getInitialState()

export default (state = initialState, action) => {
  if (actionMatchCreator(action, [
    changeDate,
  ])) {
    return initialState;
  }

  if (actionMatchCreator(action, [
    loadToursSuccess,
  ])) {
    return tourAdapter.upsertMany(state, action.payload);
  }

  switch (action.type) {
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
