import { CENTRIFUGO_MESSAGE } from "../middlewares/CentrifugoMiddleware";
import {
  DELETE_TOUR_SUCCESS,
  LOAD_TOURS_SUCCESS,
  UPDATE_TOUR,
  tourAdapter,
} from "../../shared/logistics/redux";
import { CHANGE_DATE } from "../Dispatch/actions";


const initialState = tourAdapter.getInitialState()

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DATE:
      return initialState;

    case LOAD_TOURS_SUCCESS:
      return tourAdapter.upsertMany(state, action.payload);

    case UPDATE_TOUR:
      return tourAdapter.upsertOne(state, action.payload);

    case DELETE_TOUR_SUCCESS:
      return tourAdapter.removeOne(state, action.payload);

    case CENTRIFUGO_MESSAGE:
      return processWebsocketMessage(state, action);

    default:
      return state;
  }
}

const processWebsocketMessage = (state, action) => {
  if (action.payload.name && action.payload.data) {
    const { name, data } = action.payload;

    switch (name) {
      case 'tour:created':
      case 'tour:updated': {
        const { tour } = data;
        return tourAdapter.upsertOne(state, tour);
      }

      default:
        return {
          ...state,
        };
    }
  }

  return state;
};
