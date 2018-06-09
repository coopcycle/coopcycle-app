import { createAction } from 'redux-actions'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import API from '../../API'

/*
 * Action Types
 */

export const SET_BASE_URL = 'SET_BASE_URL'
export const SET_HTTP_CLIENT = 'SET_HTTP_CLIENT'
export const SET_USER = 'SET_USER'
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

/*
 * Action Creators
 */

export const setCurrentRoute = createAction(SET_CURRENT_ROUTE)

const _setHttpClient = createAction(SET_HTTP_CLIENT)
const _setUser = createAction(SET_USER)
const _setBaseURL = createAction(SET_BASE_URL)

export function bootstrap(baseURL, user) {
  return function (dispatch, getState) {
    const httpClient = API.createClient(baseURL, user)

    dispatch(_setUser(user))
    dispatch(_setHttpClient(httpClient))
    dispatch(_setBaseURL(baseURL))

    configureBackgroundGeolocation(httpClient, user)
  }
}

export function setBaseURL(baseURL) {
  return function (dispatch, getState) {
    const { app } = getState()
    const { user } = app

    const httpClient = API.createClient(baseURL, user)

    dispatch(_setHttpClient(httpClient))
    dispatch(_setBaseURL(baseURL))

    configureBackgroundGeolocation(httpClient, user)
  }
}

export function login(user) {
  return function (dispatch, getState) {
    const { app } = getState()
    const { httpClient, user } = app

    configureBackgroundGeolocation(httpClient, user)
  }
}

export function logout() {
  return function (dispatch, getState) {

  }
}

function configureBackgroundGeolocation(httpClient, user) {

  let options = {
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 5,
    distanceFilter: 10,
    debug: false,
    startOnBoot: false,
    startForeground: false,
    stopOnTerminate: true,
    stopOnStillActivity: false,
    locationProvider: BackgroundGeolocation.RAW_PROVIDER,
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
