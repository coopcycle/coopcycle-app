/*
 * App reducer, dealing with non-domain specific state
 */
import { CONNECTED, DISCONNECTED, RECONNECTED } from '../middlewares/WebSocketMiddleware'


const initialState = {
  isWsOpen: false,
  serverURI: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECTED:
    case RECONNECTED:
      return {
        ...state,
        isWsOpen: true,
      }

    case DISCONNECTED:
      return {
        ...state,
        isWsOpen: false,
      }

    default:
      return { ...state }
  }
}
