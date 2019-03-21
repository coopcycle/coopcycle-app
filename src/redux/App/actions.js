import { createAction } from 'redux-actions'
import moment from 'moment'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import { NavigationActions } from 'react-navigation'
import firebase from 'react-native-firebase'
import BleManager from 'react-native-ble-manager'

import API from '../../API'
import AppUser from '../../AppUser'
import Settings from '../../Settings'
import Preferences from '../../Preferences'
import { setTasksFilter, setKeepAwake, setSignatureScreenFirst } from '../Courier/taskActions'
import NavigationHolder from '../../NavigationHolder'
import i18n from '../../i18n'

/*
 * Action Types
 */

export const SET_BASE_URL = 'SET_BASE_URL'
export const SET_HTTP_CLIENT = 'SET_HTTP_CLIENT'
export const SET_USER = 'SET_USER'
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE'
export const STORE_REMOTE_PUSH_TOKEN = 'STORE_REMOTE_PUSH_TOKEN'
export const SAVE_REMOTE_PUSH_TOKEN = 'SAVE_REMOTE_PUSH_TOKEN'
export const LOGIN = '@app/LOGIN'
export const LOGOUT = '@app/LOGOUT'
export const SET_LOADING = '@app/SET_LOADING'
export const PUSH_NOTIFICATION = '@app/PUSH_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = '@app/CLEAR_NOTIFICATIONS'
export const AUTHENTICATION_REQUEST = '@app/AUTHENTICATION_REQUEST'
export const AUTHENTICATION_SUCCESS = '@app/AUTHENTICATION_SUCCESS'
export const AUTHENTICATION_FAILURE = '@app/AUTHENTICATION_FAILURE'
export const RESET_PASSWORD_INIT = '@app/RESET_PASSWORD_INIT'
export const RESET_PASSWORD_REQUEST = '@app/RESET_PASSWORD_REQUEST'
export const RESET_PASSWORD_REQUEST_SUCCESS = '@app/RESET_PASSWORD_REQUEST_SUCCESS'
export const RESET_PASSWORD_REQUEST_FAILURE = '@app/RESET_PASSWORD_REQUEST_FAILURE'
export const LOGOUT_SUCCESS = '@app/LOGOUT_SUCCESS'
export const AUTHENTICATE = '@app/AUTHENTICATE'
export const RESUME_CHECKOUT_AFTER_ACTIVATION = '@app/RESUME_CHECKOUT_AFTER_ACTIVATION'
export const SET_SERVERS = '@app/SET_SERVERS'
export const THERMAL_PRINTER_CONNECTED = '@app/THERMAL_PRINTER_CONNECTED'
export const THERMAL_PRINTER_DEVICE_ID = '@app/THERMAL_PRINTER_DEVICE_ID'
export const SET_SELECT_SERVER_ERROR = '@app/SET_SELECT_SERVER_ERROR'
export const CLEAR_SELECT_SERVER_ERROR = '@app/CLEAR_SELECT_SERVER_ERROR'

export const LOAD_MY_STORES_SUCCESS = '@store/LOAD_MY_STORES_SUCCESS'

export const LOAD_MY_RESTAURANTS_REQUEST = '@restaurant/LOAD_MY_RESTAURANTS_REQUEST'
export const LOAD_MY_RESTAURANTS_SUCCESS = '@restaurant/LOAD_MY_RESTAURANTS_SUCCESS'
export const LOAD_MY_RESTAURANTS_FAILURE = '@restaurant/LOAD_MY_RESTAURANTS_FAILURE'

/*
 * Action Creators
 */

export const setLoading = createAction(SET_LOADING)
export const pushNotification = createAction(PUSH_NOTIFICATION, (event, params = {}) => ({ event, params }))
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS)

export const authenticationRequest = createAction(AUTHENTICATION_REQUEST)
export const authenticationSuccess = createAction(AUTHENTICATION_SUCCESS)
export const authenticationFailure = createAction(AUTHENTICATION_FAILURE)

const resetPasswordInit = createAction(RESET_PASSWORD_INIT)
const resetPasswordRequest = createAction(RESET_PASSWORD_REQUEST)
const resetPasswordRequestSuccess = createAction(RESET_PASSWORD_REQUEST_SUCCESS)
const resetPasswordRequestFailure = createAction(RESET_PASSWORD_REQUEST_FAILURE)

export const logoutSuccess = createAction(LOGOUT_SUCCESS)
export const setServers = createAction(SET_SERVERS)
export const thermalPrinterConnected = createAction(THERMAL_PRINTER_CONNECTED)
export const setThermalPrinterDeviceId = createAction(THERMAL_PRINTER_DEVICE_ID)

const _setHttpClient = createAction(SET_HTTP_CLIENT)
const _setUser = createAction(SET_USER)
const _setBaseURL = createAction(SET_BASE_URL)
const _setCurrentRoute = createAction(SET_CURRENT_ROUTE)
const _setSelectServerError = createAction(SET_SELECT_SERVER_ERROR)
const _clearSelectServerError = createAction(CLEAR_SELECT_SERVER_ERROR)

const _resumeCheckoutAfterActivation = createAction(RESUME_CHECKOUT_AFTER_ACTIVATION)

const _storeRemotePushToken = createAction(STORE_REMOTE_PUSH_TOKEN)
const _saveRemotePushToken = createAction(SAVE_REMOTE_PUSH_TOKEN)

const _loadMyStoresSuccess = createAction(LOAD_MY_STORES_SUCCESS)

const loadMyRestaurantsRequest = createAction(LOAD_MY_RESTAURANTS_REQUEST)
const loadMyRestaurantsSuccess = createAction(LOAD_MY_RESTAURANTS_SUCCESS)
const loadMyRestaurantsFailure = createAction(LOAD_MY_RESTAURANTS_FAILURE)

const _authenticate = createAction(AUTHENTICATE)

function authenticate(username) {

  return function (dispatch, getState) {
    dispatch(_authenticate(username))
    NavigationHolder.navigate('AccountAuthenticated')
  }
}

function navigateToHome(dispatch, getState) {

  const { httpClient, user } = getState().app

  if (user && user.isAuthenticated()) {
    if (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) {

      const req = user.hasRole('ROLE_ADMIN') ?
        httpClient.get('/api/restaurants') : httpClient.get('/api/me/restaurants')

      dispatch(loadMyRestaurantsRequest())

      req
        .then(res => {

          const restaurants = res['hydra:member']
          dispatch(loadMyRestaurantsSuccess(restaurants))

          // Users may have both ROLE_ADMIN & ROLE_COURIER
          if (user.hasRole('ROLE_COURIER')) {
            NavigationHolder.navigate('CourierHome')
          } else if (user.hasRole('ROLE_ADMIN')) {
            NavigationHolder.navigate('DispatchHome')
          } else {
            if (restaurants.length > 0) {
              NavigationHolder.navigate('RestaurantHome')
            } else {
              NavigationHolder.navigate('CheckoutHome')
            }
          }
        })
        .catch(e => {
          dispatch(loadMyRestaurantsFailure(e))
          NavigationHolder.navigate('CheckoutHome')
        })

    } else if (user.hasRole('ROLE_STORE')) {

      dispatch(setLoading(true))

      httpClient.get('/api/me/stores')
        .then(res => {
          dispatch(setLoading(false))
          const stores = res['hydra:member']
          dispatch(_loadMyStoresSuccess(stores))
          if (stores.length > 0) {
            NavigationHolder.navigate('StoreHome')
          } else {
            NavigationHolder.navigate('CheckoutHome')
          }
        })
        .catch(e => {
          dispatch(setLoading(false))
        })

    } else if (user.hasRole('ROLE_COURIER')) {
      return NavigationHolder.navigate('CourierHome')
    } else {
      NavigationHolder.navigate('CheckoutHome')
    }
  } else {
    NavigationHolder.navigate('CheckoutHome')
  }
}

export function selectServer(server) {

  return function (dispatch, getState) {

    dispatch(setLoading(true))
    dispatch(_clearSelectServerError())

    API.checkServer(server)
      .then(baseURL =>
        Settings
          .saveServer(baseURL)
          .then(() => Settings.synchronize(baseURL))
          .then(() => setBaseURL(dispatch, baseURL))
          .then(() => dispatch(_clearSelectServerError()))
          .then(() => dispatch(setLoading(false)))
          .then(() => NavigationHolder.dispatch(
            NavigationActions.navigate({
              routeName: 'CheckoutHome',
              key: 'CheckoutHome',
            })
          ))
      )
      .catch((err) => {
        setTimeout(() => {
          const message = err.message ? err.message : i18n.t('TRY_LATER')
          dispatch(setLoading(false))
          dispatch(_setSelectServerError(message))
        }, 500)
      })
  }
}

export function bootstrap(baseURL, user) {
  return function (dispatch, getState) {
    const httpClient = API.createClient(baseURL, user)

    dispatch(_setUser(user))
    dispatch(_setHttpClient(httpClient))
    dispatch(_setBaseURL(baseURL))

    Preferences.getTasksFilters().then(filters => dispatch(setTasksFilter(filters)))
    Preferences.getKeepAwake().then(keepAwake => dispatch(setKeepAwake(keepAwake)))
    Preferences.getSignatureScreenFirst().then(first => dispatch(setSignatureScreenFirst(first)))

    configureBackgroundGeolocation()
    saveRemotePushToken(dispatch, getState)

    BleManager.start({ showAlert: false })

    // Navigate to screen depending on user state
    if (user.isAuthenticated()) {
      dispatch(authenticate(user.username))
    }

    setTimeout(() => navigateToHome(dispatch, getState), 0)
  }
}

function setBaseURL(dispatch, baseURL) {

  return new Promise(resolve => {
    AppUser.load()
      .then(user => {
        const httpClient = API.createClient(baseURL, user)

        dispatch(_setUser(user))
        dispatch(_setHttpClient(httpClient))
        dispatch(_setBaseURL(baseURL))

        configureBackgroundGeolocation()

        resolve()
      })
  })
}

export function setCurrentRoute(routeName) {

  return (dispatch, getState) => {
    dispatch(_setCurrentRoute(routeName))
    firebase.analytics().setCurrentScreen(routeName)
  }
}

export function setRemotePushToken(remotePushToken) {
  return function (dispatch, getState) {
    // As remote push notifications are configured very early,
    // most of the time the user won't be authenticated
    // (for example, when app is launched for the first time)
    // We store the token for later, when the user authenticates
    try {
      AsyncStorage
        .setItem('remotePushToken', remotePushToken)
        .then(() => dispatch(_storeRemotePushToken()))
        .catch(e => console.log(e))
    } catch (e) {
      console.log(e)
    }
  }
}

export function login(email, password, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.login(email, password)
      .then(user => {
        onAuthenticationSuccess(dispatch, getState)
        NavigationHolder.navigate('AccountAuthenticated')

        if (navigate) {
          navigateToHome(dispatch, getState)
        }
      })
      .catch(err => {

        let message = i18n.t('TRY_LATER')
        if (err.hasOwnProperty('code') && err.code === 401) {
          message = i18n.t('INVALID_USER_PASS')
        }

        dispatch(authenticationFailure(message))

      })
  }
}

export function logout() {

  return (dispatch, getState) => {

    const { user } = getState().app

    user.logout()
      .then(() => {
        NavigationHolder.navigate('AccountNotAuthenticated')
        dispatch(logoutSuccess())
      })
  }
}

export function register(data, checkEmailRouteName, loginRouteName, resumeCheckoutAfterActivation = false) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.register(data)
      .then(user => {

        // Registration may require email confirmation.
        // If the user is enabled, we login immediately.
        // otherwise we wait for confirmation (via deep linking)
        if (user.enabled) {
          onAuthenticationSuccess(dispatch, getState)

        } else {
          dispatch(setLoading(false))
          dispatch(_resumeCheckoutAfterActivation(resumeCheckoutAfterActivation))

          // FIXME When using navigation, we can still go back to the filled form
          NavigationHolder.navigate(checkEmailRouteName, { email: user.email, loginRouteName })
        }
      })
      .catch(err => {

        let message = i18n.t('TRY_LATER')
        if (err.hasOwnProperty('status') && err.status === 400) {
          message = i18n.t('EMAIL_ALREADY_REGISTERED')
        }

        dispatch(authenticationFailure(message))

      })
  }
}

export function confirmRegistration(token) {
  return (dispatch, getState) => {
    const { app } = getState()
    const { httpClient, resumeCheckoutAfterActivation } = app

    dispatch(authenticationRequest())

    httpClient.confirmRegistration(token)
      .then(credentials => {
        onAuthenticationSuccess(dispatch, getState)

        if (resumeCheckoutAfterActivation) {
          dispatch(_resumeCheckoutAfterActivation(false))
        } else {
          navigateToHome(dispatch, getState)
        }
      })
      .catch(err => {
        console.log(err);
        if (err.hasOwnProperty('status') && err.status === 401) {
          dispatch(setLoading(false))
          // TODO Say that the token is no valid
        }
      })
  }
}

export function forgotPassword() {
  return (dispatch, getState) => {
    dispatch(resetPasswordInit())
  }
}

export function resetPassword(username, checkEmailRouteName, resumeCheckoutAfterActivation) {
  return (dispatch, getState) => {
    const {app} = getState();
    const {httpClient} = app;

    dispatch(resetPasswordRequest())

    httpClient
      .resetPassword(username)
      .then(response => {
        dispatch(resetPasswordRequestSuccess());
        dispatch(_resumeCheckoutAfterActivation(resumeCheckoutAfterActivation));

        NavigationHolder.navigate(checkEmailRouteName, {email: username});
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        dispatch(resetPasswordRequestFailure(message))
      });
  };
}

export function setNewPassword(token, password) {
  return (dispatch, getState) => {
    const {app} = getState();
    const {httpClient, resumeCheckoutAfterActivation} = app;

    dispatch(authenticationRequest());

    httpClient
      .setNewPassword(token, password)
      .then(credentials => {
        onAuthenticationSuccess(dispatch, getState);

        if (resumeCheckoutAfterActivation) {
          dispatch(_resumeCheckoutAfterActivation(false));
        } else {
          navigateToHome(dispatch, getState);
        }
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER')

        if (err.hasOwnProperty('status')) {
          switch (err.status) {
            case 400:
              message = i18n.t('RESET_PASSWORD_LINK_EXPIRED')
              break;
            case 401:
              message = i18n.t('AN_ERROR_OCCURRED')
              break;
          }
        }

        dispatch(authenticationFailure(message));
      });
  };
}

export function resetServer() {

  return async (dispatch, getState) => {

      const { user } = getState().app

      if (user) {
        await user.logout()
      }
      dispatch(logoutSuccess())

      await Settings.removeServer()

      NavigationHolder.navigate('ConfigureServer')
  }
}

function onAuthenticationSuccess(dispatch, getState) {

  const { app } = getState()

  const { baseURL, user } = app

  const httpClient = API.createClient(baseURL, user)

  dispatch(_setUser(user))
  dispatch(_setHttpClient(httpClient))

  dispatch(authenticationSuccess())

  setTimeout(() => {
    configureBackgroundGeolocation()
    saveRemotePushToken(dispatch, getState)
  }, 0)
}

function saveRemotePushToken(dispatch, getState) {

  const { app } = getState()
  const { httpClient, user } = app

  try {
    AsyncStorage.getItem('remotePushToken')
      .then((remotePushToken, error) => {
        if (error) {
          console.log(error)
          return
        }
        if (remotePushToken) {
          if (user.isAuthenticated()) {
            postRemotePushToken(httpClient, remotePushToken)
              .then(() => AsyncStorage.removeItem('remotePushToken'))
              .then(() => dispatch(_saveRemotePushToken()))
              .catch(e => console.log(e))
          }
        }
      })
  } catch (e) {
    console.log(e)
  }
}

function postRemotePushToken(httpClient, token) {
  return httpClient
    .post('/api/me/remote_push_tokens', { platform: Platform.OS, token })
}

function configureBackgroundGeolocation() {

  const options = {
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 5,
    distanceFilter: 10,
    debug: process.env.NODE_ENV === 'development',
    startOnBoot: false,
    startForeground: true,
    notificationTitle: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TITLE'),
    notificationText: i18n.t('BACKGROUND_GEOLOCATION_NOTIFICATION_TEXT'),
    stopOnTerminate: true,
    stopOnStillActivity: false,
    locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
    interval: 3000,
    fastestInterval: 1000,
    activitiesInterval: 5000,
    // option.maxLocations has to be larger than option.syncThreshold.
    // It's recommended to be 2x larger.
    // In any other case the location syncing might not work properly.
    maxLocations: 10,
    syncThreshold: 5,
  }

  BackgroundGeolocation.configure(options)
}
