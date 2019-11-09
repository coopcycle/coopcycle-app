import { createAction } from 'redux-actions'
import moment from 'moment'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import { NavigationActions } from 'react-navigation'
import { BleManager, State } from 'react-native-ble-plx'
import { Buffer } from 'buffer'
import EscPosEncoder from 'esc-pos-encoder'
import diacritics from 'diacritics'

import API from '../../API'
import AppUser from '../../AppUser'
import Settings from '../../Settings'
import Preferences from '../../Preferences'
import { formatPrice } from '../../Cart'
import { setTasksFilter, setKeepAwake } from '../Courier/taskActions'
import {
  loadMyRestaurantsRequest,
  loadMyRestaurantsSuccess,
  loadMyRestaurantsFailure,
} from '../Restaurant/actions'
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
export const TRACKER_INITIALIZED = '@app/TRACKER_INITIALIZED'
export const TRACKER_DISABLED = '@app/TRACKER_DISABLED'
export const THERMAL_PRINTER_CONNECTED = '@app/THERMAL_PRINTER_CONNECTED'
export const THERMAL_PRINTER_DEVICE_ID = '@app/THERMAL_PRINTER_DEVICE_ID'
export const SET_SELECT_SERVER_ERROR = '@app/SET_SELECT_SERVER_ERROR'
export const CLEAR_SELECT_SERVER_ERROR = '@app/CLEAR_SELECT_SERVER_ERROR'

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
export const authenticate = createAction(AUTHENTICATE)
export const setServers = createAction(SET_SERVERS)
export const trackerInitialized = createAction(TRACKER_INITIALIZED)
export const trackerDisabled = createAction(TRACKER_DISABLED)
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

    } else if (user.hasRole('ROLE_COURIER')) {
      return NavigationHolder.navigate('CourierHome')
    } else {
      NavigationHolder.navigate('CheckoutHome')
    }
  } else {
    NavigationHolder.navigate('CheckoutHome')
  }
}

const bleManager = new BleManager()

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

    configureBackgroundGeolocation(httpClient, user)
    saveRemotePushToken(dispatch, getState)
    initBLE(dispatch)

    // Navigate to screen depending on user state
    if (user.isAuthenticated()) {
      httpClient.checkToken()
        .then(() => {
          dispatch(authenticate())
          navigateToHome(dispatch, getState)
        })
        .catch(e => {
          httpClient.refreshToken()
            .then(token => {
              dispatch(authenticate())
              navigateToHome(dispatch, getState)
            })
            .catch(e => {
              user
                .logout()
                .then(() => navigateToHome(dispatch, getState))
            })
        })
    } else {
      navigateToHome(dispatch, getState)
    }
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

        configureBackgroundGeolocation(httpClient, user)

        resolve()
      })
  })
}

export function setCurrentRoute(routeName) {

  return (dispatch, getState) => {

    dispatch(_setCurrentRoute(routeName))

    const { app } = getState()
    const { trackerInitialized } = app

    // TODO Set route name in Firebase Analytics
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
      .then(() => dispatch(logoutSuccess()))
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
  dispatch(authenticationSuccess())

  const {app} = getState()
  const {httpClient, user} = app

  configureBackgroundGeolocation(httpClient, user)
  saveRemotePushToken(dispatch, getState)
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

function configureBackgroundGeolocation(httpClient, user) {

  let options = {
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

  if (user && user.isAuthenticated()) {
    options = Object.assign(options, {
      url: httpClient.getBaseURL() + '/api/me/location',
      syncUrl: httpClient.getBaseURL() + '/api/me/location',
      httpHeaders: {
        'Authorization': `Bearer ${httpClient.getToken()}`,
        'Content-Type': 'application/ld+json',
      },
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
        time: '@time',
      },
    })
  }

  BackgroundGeolocation.configure(options)

  BackgroundGeolocation.removeAllListeners('http_authorization')

  BackgroundGeolocation.on('http_authorization', () => {
    httpClient.refreshToken()
      .then(token => {
        BackgroundGeolocation.configure({
          httpHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/ld+json',
          },
        })
      })
      .catch(e => console.log(e))
  })
}

function splitter(str, l){
  var strs = [];
  while (str.length > l){
    var pos = str.substring(0, l).lastIndexOf(' ');
    pos = pos <= 0 ? l : pos;
    strs.push(str.substring(0, pos));
    var i = str.indexOf(' ', pos) + 1;
    if (i < pos || i > pos + l)
        {i = pos;}
    str = str.substring(i);
  }
  strs.push(str);
  return strs;
}

function initBLE(dispatch) {

  bleManager.onStateChange((state) => {
    if (state === State.PoweredOn) {

      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }

        if (device.name === 'MTP-II') {

          bleManager.stopDeviceScan()

          device.connect()
            .then((device) => device.discoverAllServicesAndCharacteristics())
            .then((device) => {
              dispatch(setThermalPrinterDeviceId(device.id))
              dispatch(thermalPrinterConnected())
            })
            .catch((error) => {
              // Handle errors
              console.log('BLE CONNECT ERROR', error)
            })
        }
      })

      setTimeout(() => {
        bleManager.stopDeviceScan()
      }, 10000)

    }
  }, true);
}

export function printOrder(order) {

  return (dispatch, getState) => {

    const thermalPrinterDeviceId = getState().app.thermalPrinterDeviceId

    if (!thermalPrinterDeviceId) {
      return
    }

    dispatch(setLoading(true))

    const maxChars = 32

    const preparationExpectedAt = moment(order.preparationExpectedAt).format('LT')
    const pickupExpectedAt = moment(order.pickupExpectedAt).format('LT')

    const preparationLine = 'A COMMENCER A PARTIR DE '.padEnd((maxChars - preparationExpectedAt.length), ' ') + preparationExpectedAt
    const pickupLine = 'A PREPARER POUR '.padEnd((maxChars - pickupExpectedAt.length), ' ') + pickupExpectedAt

    let encoder = new EscPosEncoder()
    encoder
      .initialize()
      .line(''.padEnd(maxChars, '-'))
      .align('center')
      .line(`COMMANDE ${order.number} #${order.id}`)
      .line(''.padEnd(maxChars, '-'))

    bleManager.writeCharacteristicWithResponseForDevice(
      thermalPrinterDeviceId,
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
      Buffer.from(encoder.encode()).toString('base64')
    )

    encoder
      .align('left')
      .line(preparationLine)
      .line(pickupLine)
      .line(''.padEnd(maxChars, '-'))
      .newline()
      // .line('Tarte aux pommes           12EUR')

    bleManager.writeCharacteristicWithResponseForDevice(
      thermalPrinterDeviceId,
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
      Buffer.from(encoder.encode()).toString('base64')
    )

    order.items.forEach((item) => {

      let price = `  ${formatPrice(item.total)} EUR`
      let name = diacritics.remove(item.name)

      name = `${item.quantity} x ${name}`

      let padding = price.length
      let maxLength = maxChars - padding

      encoder.align('left')

      let lines = splitter(name, maxLength)

      lines.forEach((line, index) => {
        if (index === 0) {
          line = line.padEnd(maxLength, ' ')
          encoder.line(`${line}${price}`)
        } else {
          encoder.line(line)
        }
      })

      bleManager.writeCharacteristicWithResponseForDevice(
        thermalPrinterDeviceId,
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
        Buffer.from(encoder.encode()).toString('base64')
      )

      if (item.adjustments.hasOwnProperty('menu_item_modifier')) {
        item.adjustments.menu_item_modifier.forEach((adjustment) => {
          encoder.line(`- ${adjustment.label}`)
        })
        bleManager.writeCharacteristicWithResponseForDevice(
          thermalPrinterDeviceId,
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
          Buffer.from(encoder.encode()).toString('base64')
        )
      }

      encoder.newline()

    })

    encoder
      .line(''.padEnd(maxChars, '-'))

    let total = `${formatPrice(order.itemsTotal)} EUR`
    let totalLine = 'TOTAL '.padEnd((maxChars - total.length), ' ') + total

    encoder
      .align('left')
      .line(totalLine)
      .line(''.padEnd(maxChars, '-'))

    bleManager.writeCharacteristicWithResponseForDevice(
      thermalPrinterDeviceId,
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
      Buffer.from(encoder.encode()).toString('base64')
    )

    if (order.notes) {
      let notes = diacritics.remove(order.notes)
      encoder
        .line(notes)
        .line(''.padEnd(maxChars, '-'))
      bleManager.writeCharacteristicWithResponseForDevice(
        thermalPrinterDeviceId,
        'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
        'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
        Buffer.from(encoder.encode()).toString('base64')
      )
    }

    encoder
      .newline()
      .newline()
      .newline()

    bleManager.writeCharacteristicWithResponseForDevice(
      thermalPrinterDeviceId,
      'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
      'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f',
      Buffer.from(encoder.encode()).toString('base64')
    )

    dispatch(setLoading(false))
  }
}
