import { createAction } from 'redux-actions'
import { AsyncStorage, Platform } from 'react-native'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import API from '../../API'
import AppUser from '../../AppUser'
import Preferences from '../../Preferences'
import { setTasksFilter } from '../Courier/taskActions'
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

/*
 * Action Creators
 */

export const setCurrentRoute = createAction(SET_CURRENT_ROUTE)

const _setHttpClient = createAction(SET_HTTP_CLIENT)
const _setUser = createAction(SET_USER)
const _setBaseURL = createAction(SET_BASE_URL)

const _storeRemotePushToken = createAction(STORE_REMOTE_PUSH_TOKEN)
const _saveRemotePushToken = createAction(SAVE_REMOTE_PUSH_TOKEN)

export function bootstrap(baseURL, user) {
  return function (dispatch, getState) {
    const httpClient = API.createClient(baseURL, user)

    dispatch(_setUser(user))
    dispatch(_setHttpClient(httpClient))
    dispatch(_setBaseURL(baseURL))

    Preferences.getTasksFilters().then(filters => dispatch(setTasksFilter(filters)))

    configureBackgroundGeolocation(httpClient, user)
    saveRemotePushToken(dispatch, getState)
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

export function login(user) {
  return function (dispatch, getState) {
    const { app } = getState()
    const { httpClient, user } = app

    configureBackgroundGeolocation(httpClient, user)
    saveRemotePushToken(dispatch, getState)
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
