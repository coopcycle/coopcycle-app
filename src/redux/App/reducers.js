/*
 * App reducer, dealing with non-domain specific state
 */
import { CONNECTED, DISCONNECTED, RECONNECTED } from '../middlewares/WebSocketMiddleware'
import {
  SET_BASE_URL,
  SET_HTTP_CLIENT,
  SET_USER,
  SET_CURRENT_ROUTE,
  STORE_REMOTE_PUSH_TOKEN,
  SAVE_REMOTE_PUSH_TOKEN,
  LOGIN,
  LOGOUT
} from './actions'

const initialState = {
  isWsOpen: false,
  baseURL: null,
  httpClient: null,
  user: null,
  currentRoute: null,
  remotePushTokenStored: false,
  remotePushTokenSaved: false
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_BASE_URL:
      return {
        ...state,
        baseURL: action.payload,
      }
    case SET_HTTP_CLIENT:
      return {
        ...state,
        httpClient: action.payload,
      }
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      }
    case SET_CURRENT_ROUTE:
      return {
        ...state,
        currentRoute: action.payload,
      }
    case STORE_REMOTE_PUSH_TOKEN:
      return {
        ...state,
        remotePushTokenStored: true,
      }
    case SAVE_REMOTE_PUSH_TOKEN:
      return {
        ...state,
        remotePushTokenStored: false,
        remotePushTokenSaved: true,
      }
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
