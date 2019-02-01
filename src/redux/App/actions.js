import { createAction } from 'redux-actions'
import { AsyncStorage, Platform } from 'react-native'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'
import { NavigationActions, StackActions } from 'react-navigation'
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
export const LOGIN = '@app/LOGIN'
export const LOGOUT = '@app/LOGOUT'
export const SET_LOADING = '@app/SET_LOADING'
export const PUSH_NOTIFICATION = '@app/PUSH_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = '@app/CLEAR_NOTIFICATIONS'
export const AUTHENTICATION_REQUEST = '@app/AUTHENTICATION_REQUEST'
export const AUTHENTICATION_SUCCESS = '@app/AUTHENTICATION_SUCCESS'
export const AUTHENTICATION_FAILURE = '@app/AUTHENTICATION_FAILURE'
export const LOGOUT_SUCCESS = '@app/LOGOUT_SUCCESS'
export const AUTHENTICATE = '@app/AUTHENTICATE'

/*
 * Action Creators
 */

export const setCurrentRoute = createAction(SET_CURRENT_ROUTE)
export const setLoading = createAction(SET_LOADING)
export const pushNotification = createAction(PUSH_NOTIFICATION, (event, params = {}) => ({ event, params }))
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS)

export const authenticationRequest = createAction(AUTHENTICATION_REQUEST)
export const authenticationSuccess = createAction(AUTHENTICATION_SUCCESS)
export const authenticationFailure = createAction(AUTHENTICATION_FAILURE)

export const logoutSuccess = createAction(LOGOUT_SUCCESS)
export const authenticate = createAction(AUTHENTICATE)

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

    // Navigate to screen depending on user state
    if (user.isAuthenticated()) {
      httpClient.checkToken()
        .then(() => {
          dispatch(authenticate())
          navigateToHome(dispatch, getState)
        })
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

export function login(email, password, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.login(email, password)
      .then(user => {

        dispatch(authenticationSuccess())

        configureBackgroundGeolocation(httpClient, user)
        saveRemotePushToken(dispatch, getState)

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

export function register(data) {

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

          dispatch(authenticationSuccess())

          configureBackgroundGeolocation(httpClient, user)
          saveRemotePushToken(dispatch, getState)

        } else {

          dispatch(setLoading(false))

          // FIXME We shouldn't reset completely
          // Maybe we need to use a SwitchNavigator for login/register?
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'AccountCheckEmail',
                params: { email: user.email }
              }),
            ]
          })
          NavigationHolder.dispatch(resetAction)

          // FIXME When using navigation, we can still go back to the filled form
          // NavigationHolder.navigate('AccountCheckEmail', { email: user.email })
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
    const { httpClient, user } = app

    dispatch(authenticationRequest())

    httpClient.get(`/api/register/confirm/${token}`)
      .then(credentials => {

        console.log('USER', credentials)

        Object.assign(user, {
          username: credentials.username,
          email: credentials.email,
          token: credentials.token,
          refreshToken: credentials.refresh_token,
          roles: credentials.roles,
          enabled: credentials.enabled,
        })

        user.save()
          .then(() => {

            dispatch(authenticationSuccess())

            configureBackgroundGeolocation(httpClient, user)
            saveRemotePushToken(dispatch, getState)

            navigateToHome(dispatch, getState)

          })
      })
      .catch(err => {
        // TODO Say that the token is no valid
      })
  }
}

export function logout() {

  return (dispatch, getState) => {

    const { user } = getState().app

    user.logout()
      .then(() => {

        dispatch(logoutSuccess())

        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'AccountHome' }),
          ]
        })
        NavigationHolder.dispatch(resetAction)

      })
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
