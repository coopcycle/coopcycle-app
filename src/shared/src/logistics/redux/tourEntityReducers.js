import {
  DELETE_TOUR_SUCCESS,
  LOAD_TOURS,
  UPDATE_TOUR,
} from './actions'
import {
  tourAdapter
} from './adapters'

const initialState = tourAdapter.getInitialState()

export default (state = initialState, action) => {

  switch (action.type) {
    case LOAD_TOURS:
      return tourAdapter.upsertMany(state, action.payload)
    case UPDATE_TOUR:
      return tourAdapter.upsertOne(state, action.payload);
    case DELETE_TOUR_SUCCESS:
      return tourAdapter.removeOne(state, action.payload);
  }

  return state
}
