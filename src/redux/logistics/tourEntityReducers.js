import {
  changeDate,
} from "../Dispatch/actions";
import {
  DELETE_TOUR_SUCCESS,
  UPDATE_TOUR,
  createTourSuccess,
  loadToursSuccess,
  tourAdapter,
  updateTourSuccess,
} from "../../shared/logistics/redux";
import { actionMatchCreator } from "../util";
import { SET_USER } from "../App/actions";


const initialState = tourAdapter.getInitialState()

export default (state = initialState, action) => {
  if (changeDate.match(action) || action.type === SET_USER) {
    return initialState;
  }

  if (actionMatchCreator(action, [
    loadToursSuccess,
  ])) {
    return tourAdapter.upsertMany(state, action.payload);
  }

  if (actionMatchCreator(action, [
    createTourSuccess,
    updateTourSuccess,
  ])) {
    return tourAdapter.upsertOne(state, action.payload);
  }

  switch (action.type) {
    case UPDATE_TOUR:
      return tourAdapter.upsertOne(state, action.payload);

    case DELETE_TOUR_SUCCESS:
      return tourAdapter.removeOne(state, action.payload);

    default:
      return state;
  }
}
