/*
/*
 * App reducer, dealing with non-domain specific state
 */
import { CONNECTED, DISCONNECTED } from '../middlewares/CentrifugoMiddleware'
import {
  ACCEPT_PRIVACY_POLICY, ACCEPT_TERMS_AND_CONDITIONS,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_REQUEST,
  AUTHENTICATION_SUCCESS,
  BACKGROUND_PERMISSION_DISCLOSED,
  CLEAR_AUTHENTICATION_ERRORS,
  CLEAR_NOTIFICATIONS,
  CLEAR_SELECT_SERVER_ERROR,
  CLOSE_MODAL,
  DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
  LOAD_PRIVACY_POLICY_FAILURE,
  LOAD_PRIVACY_POLICY_REQUEST,
  LOAD_PRIVACY_POLICY_SUCCESS,
  LOAD_TERMS_AND_CONDITIONS_FAILURE,
  LOAD_TERMS_AND_CONDITIONS_REQUEST,
  LOAD_TERMS_AND_CONDITIONS_SUCCESS,
  LOGIN_BY_EMAIL_ERRORS,
  LOGOUT_SUCCESS,
  ONBOARDED,
  PUSH_NOTIFICATION,
  REGISTER_PUSH_NOTIFICATION_TOKEN,
  REGISTRATION_ERRORS,
  RESET_MODAL,
  RESET_PASSWORD_INIT,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_REQUEST_FAILURE,
  RESET_PASSWORD_REQUEST_SUCCESS,
  RESUME_CHECKOUT_AFTER_ACTIVATION,
  SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
  SET_BACKGROUND_GEOLOCATION_ENABLED,
  SET_BASE_URL,
  SET_CURRENT_ROUTE,
  SET_HTTP_CLIENT,
  SET_INTERNET_REACHABLE,
  SET_LOADING,
  SET_MODAL, SET_SELECT_SERVER_ERROR, SET_SERVERS, SET_SETTINGS, SET_USER,
} from './actions'
import Config from 'react-native-config';

const initialState = {
  customBuild: !!Config.DEFAULT_SERVER,
  firstRun: true,
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
  resumeCheckoutAfterActivation: null, // vendor id where checkout was initiated
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
  loginByEmailErrors: {},
  isBackgroundGeolocationEnabled: false,
  hasDisclosedBackgroundPermission: false,
  isCentrifugoConnected: false,
  modal: {
    show: false,
    skippable: false,
    content: null,
    type: 'default',
  },
  termsAndConditionsAccepted: false,
  privacyPolicyAccepted: false,
  loadingTerms: false,
  loadingPrivacyPolicy: false,
  termsAndConditionsText: '',
  privacyPolicyText: '',
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
        notifications: state.notifications.concat([action.payload]),
      }

    case CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      }

    case CLEAR_AUTHENTICATION_ERRORS:
      return {
        ...state,
        lastAuthenticationError: null,
        registrationErrors: initialState.registrationErrors,
        loginByEmailErrors: initialState.loginByEmailErrors,
      }

    case AUTHENTICATION_REQUEST:
      return {
        ...state,
        loading: true,
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

    case LOGIN_BY_EMAIL_ERRORS:
      return {
        ...state,
        loginByEmailErrors: action.payload,
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

    case ONBOARDED:
      return {
        ...state,
        firstRun: false,
      }

    case ACCEPT_TERMS_AND_CONDITIONS:
      return {
        ...state,
        termsAndConditionsAccepted: action.payload,
      }

    case ACCEPT_PRIVACY_POLICY:
      return {
        ...state,
        privacyPolicyAccepted: action.payload,
      }

    case LOAD_PRIVACY_POLICY_REQUEST:
      return {
        ...state,
        loadingPrivacyPolicy: true,
      }

    case LOAD_PRIVACY_POLICY_SUCCESS:
      return {
        ...state,
        privacyPolicyText: action.payload,
        loadingPrivacyPolicy: false,
      }

    case LOAD_PRIVACY_POLICY_FAILURE:
      return {
        ...state,
        loadingPrivacyPolicy: false,
      }

    case LOAD_TERMS_AND_CONDITIONS_REQUEST:
      return {
        ...state,
        loadingTerms: true,
      }

    case LOAD_TERMS_AND_CONDITIONS_SUCCESS:
      return {
        ...state,
        termsAndConditionsText: action.payload,
        loadingTerms: false,
      }

    case LOAD_TERMS_AND_CONDITIONS_FAILURE:
      return {
        ...state,
        loadingTerms: false,
      }
  }

  return state
}
