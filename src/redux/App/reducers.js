/*
 * App reducer, dealing with non-domain specific state
 */
import { CONNECTED, DISCONNECTED } from '../middlewares/CentrifugoMiddleware'
import {
  SET_BASE_URL,
  SET_HTTP_CLIENT,
  SET_USER,
  SET_CURRENT_ROUTE,
  SET_LOADING,
  REGISTER_PUSH_NOTIFICATION_TOKEN,
  SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
  DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
  PUSH_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  LOGOUT_SUCCESS,
  RESUME_CHECKOUT_AFTER_ACTIVATION,
  RESET_PASSWORD_INIT,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST_SUCCESS,
  RESET_PASSWORD_REQUEST_FAILURE,
  SET_SERVERS,
  SET_SELECT_SERVER_ERROR,
  CLEAR_SELECT_SERVER_ERROR,
  SET_SETTINGS,
  SET_INTERNET_REACHABLE,
  REGISTRATION_ERRORS,
  SET_BACKGROUND_GEOLOCATION_ENABLED,
  BACKGROUND_PERMISSION_DISCLOSED, SET_MODAL, RESET_MODAL, CLOSE_MODAL,
} from './actions'
import Config from 'react-native-config';

const initialState = {
  customBuild: !!Config.DEFAULT_SERVER,
  isWsOpen: false,
  baseURL: null,
  httpClient: null,
  user: null,
  currentRoute: null,
  pushNotificationToken: null,
  pushNotificationTokenSaved: null,
  loading: false,
  notifications: [],
  lastAuthenticationError: null,
  forgotPassword: {
    inputError: null,
    nonInputError: null,
    requested: false,
  },
  resumeCheckoutAfterActivation: false,
  servers: [],
  selectServerError: null,
  settings: {
    google_api_key: '',
    stripe_publishable_key: '',
    payment_gateway: '',
    locale: 'fr',
    country: 'fr',
    latlng: '48.872178,2.331797',
    currency_code: 'eur',
  },
  isInternetReachable: true,
  registrationErrors: {},
  isBackgroundGeolocationEnabled: false,
  hasDisclosedBackgroundPermission: false,
  isCentrifugoConnected: false,
  modal: {
    show: false,
    skippable: false,
    content: null,
    type: 'default',
  },
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
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case CONNECTED:
      return {
        ...state,
        isCentrifugoConnected: true,
      }

    case DISCONNECTED:
      return {
        ...state,
        isCentrifugoConnected: false,
      }

    case PUSH_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.concat([ action.payload ]),
      }

    case CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      }

    case AUTHENTICATION_REQUEST:
      return {
        ...state,
        lastAuthenticationError: null,
        loading: true,
        registrationErrors: initialState.registrationErrors,
      }

    case AUTHENTICATION_SUCCESS:
      return {
        ...state,
        loading: false,
      }

    case AUTHENTICATION_FAILURE:
      return {
        ...state,
        loading: false,
        lastAuthenticationError: action.payload,
      }

    case RESET_PASSWORD_INIT:
      return {
        ...state,
        forgotPassword: {
          inputError: null,
          nonInputError: null,
          requested: false,
        },
      }

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        forgotPassword: {
          ...state.forgotPassword,
          inputError: null,
          nonInputError: null,
        },
      }

    case RESET_PASSWORD_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        forgotPassword: {
          ...state.forgotPassword,
          requested: true,
        },
      }

    case RESET_PASSWORD_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        forgotPassword: {
          ...state.forgotPassword,
          nonInputError: action.payload,
        },
      }

    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
      }

    case RESUME_CHECKOUT_AFTER_ACTIVATION:
      return {
        ...state,
        resumeCheckoutAfterActivation: action.payload,
      }

    case SET_SERVERS:
      return {
        ...state,
        servers: action.payload,
      }

    case CLEAR_SELECT_SERVER_ERROR:
      return {
        ...state,
        selectServerError: null,
      }

    case SET_SELECT_SERVER_ERROR:
      return {
        ...state,
        selectServerError: action.payload,
      }

    case SET_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      }

    case SET_INTERNET_REACHABLE:
      return {
        ...state,
        isInternetReachable: action.payload,
      }

    case REGISTER_PUSH_NOTIFICATION_TOKEN:
      return {
        ...state,
        pushNotificationToken: action.payload,
        pushNotificationTokenSaved: false,
      }

    case SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS:
      return {
        ...state,
        pushNotificationTokenSaved: true,
      }

    case DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS:
      return {
        ...state,
        pushNotificationTokenSaved: false,
      }

    case REGISTRATION_ERRORS:
      return {
        ...state,
        registrationErrors: action.payload,
        loading: false,
      }

    case SET_BACKGROUND_GEOLOCATION_ENABLED:
      return {
        ...state,
        isBackgroundGeolocationEnabled: action.payload,
      }

    case BACKGROUND_PERMISSION_DISCLOSED:
      return {
        ...state,
        hasDisclosedBackgroundPermission: true,
      }

    case SET_MODAL:
      return {
        ...state,
        modal: {
          ...initialState.modal,
          show: true,
          ...action.payload,
        },
      }

    case RESET_MODAL:
      return {
        ...state,
        modal: initialState.modal,
      }

    case CLOSE_MODAL:
      return {
        ...state,
        modal: {
          ...state.modal,
          show: false,
        },
      }
  }

  return state
}
