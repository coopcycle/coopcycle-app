import {
  changeDate,
} from "../Dispatch/actions";
import {
  createTourSuccess,
  deleteTourSuccess,
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

  if (deleteTourSuccess.match(action)) {
    return tourAdapter.removeOne(state, action.payload);
  }

  return state;
}
