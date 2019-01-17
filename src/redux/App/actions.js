import { createAction } from 'redux-actions'
import { AsyncStorage, Platform } from 'react-native'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import API from '../../API'
import AppUser from '../../AppUser'
import Preferences from '../../Preferences'
import { setTasksFilter, setKeepAwake } from '../Courier/taskActions'
import {
  loadMyRestaurantsRequest,
  loadMyRestaurantsSuccess,
  loadMyRestaurantsFailure
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
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_LOADING = '@app/SET_LOADING'
export const PUSH_NOTIFICATION = '@app/PUSH_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = '@app/CLEAR_NOTIFICATIONS'

/*
 * Action Creators
 */

export const setCurrentRoute = createAction(SET_CURRENT_ROUTE)
export const setLoading = createAction(SET_LOADING)
export const pushNotification = createAction(PUSH_NOTIFICATION, (event, params = {}) => ({ event, params }))
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS)

const _setHttpClient = createAction(SET_HTTP_CLIENT)
const _setUser = createAction(SET_USER)
const _setBaseURL = createAction(SET_BASE_URL)

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

          if (user.hasRole('ROLE_ADMIN')) {
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

export function bootstrap(baseURL, user, navigation) {
  return function (dispatch, getState) {
    const httpClient = API.createClient(baseURL, user)

    dispatch(_setUser(user))
    dispatch(_setHttpClient(httpClient))
    dispatch(_setBaseURL(baseURL))

    Preferences.getTasksFilters().then(filters => dispatch(setTasksFilter(filters)))
    Preferences.getKeepAwake().then(keepAwake => dispatch(setKeepAwake(keepAwake)))

    configureBackgroundGeolocation(httpClient, user)
    saveRemotePushToken(dispatch, getState)

    // Navigate to screen depending on user state
    if (user.isAuthenticated()) {
      httpClient.checkToken()
        .then(() => navigateToHome(dispatch, getState))
        .catch(e => {
          user
            .logout()
            .then(() => navigateToHome(dispatch, getState))
        })
    } else {
      navigateToHome(dispatch, getState)
    }
  }
}

export function setBaseURL(baseURL) {
  return function (dispatch, getState) {
    AppUser.load()
      .then(user => {
        const httpClient = API.createClient(baseURL, user)

        dispatch(_setUser(user))
        dispatch(_setHttpClient(httpClient))
        dispatch(_setBaseURL(baseURL))

        configureBackgroundGeolocation(httpClient, user)
      })
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

export function login(user, navigate = true) {
  return function (dispatch, getState) {
    const { app } = getState()
    const { httpClient, user } = app

    configureBackgroundGeolocation(httpClient, user)
    saveRemotePushToken(dispatch, getState)

    if (navigate) {
      navigateToHome(dispatch, getState)
    }
  }
}

export function logout() {
  return function (dispatch, getState) {

  }
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
    maxLocations: 10,
  }

  if (user && user.isAuthenticated()) {
    options = Object.assign(options, {
      syncThreshold: 10,
      url: httpClient.getBaseURL() + '/api/me/location',
      syncUrl: httpClient.getBaseURL() + '/api/me/location',
      httpHeaders: {
        'Authorization': `Bearer ${httpClient.getToken()}`,
        'Content-Type': "application/ld+json",
      },
      postTemplate: {
        latitude: '@latitude',
        longitude: '@longitude',
        time: '@time',
      }
    })
  }

  BackgroundGeolocation.configure(options)
}
