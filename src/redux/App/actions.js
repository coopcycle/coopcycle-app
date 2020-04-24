import { createAction } from 'redux-actions'
import { NavigationActions } from 'react-navigation'
import tracker from '../../analytics/Tracker'

import API from '../../API'
import AppUser from '../../AppUser'
import Settings from '../../Settings'
import NavigationHolder from '../../NavigationHolder'
import i18n from '../../i18n'
import { setCurrencyCode } from '../../utils/formatting'

/*
 * Action Types
 */

export const SET_BASE_URL = 'SET_BASE_URL'
export const SET_HTTP_CLIENT = 'SET_HTTP_CLIENT'
export const SET_USER = 'SET_USER'
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE'

export const REGISTER_PUSH_NOTIFICATION_TOKEN = '@app/REGISTER_PUSH_NOTIFICATION_TOKEN'
export const SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS = '@app/SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS'
export const DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS = '@app/DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS'

export const LOGIN = '@app/LOGIN'
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
export const LOGOUT_REQUEST = '@app/LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = '@app/LOGOUT_SUCCESS'
export const RESUME_CHECKOUT_AFTER_ACTIVATION = '@app/RESUME_CHECKOUT_AFTER_ACTIVATION'
export const SET_SERVERS = '@app/SET_SERVERS'
export const SET_SETTINGS = '@app/SET_SETTINGS'
export const SET_SELECT_SERVER_ERROR = '@app/SET_SELECT_SERVER_ERROR'
export const CLEAR_SELECT_SERVER_ERROR = '@app/CLEAR_SELECT_SERVER_ERROR'

export const LOAD_MY_STORES_SUCCESS = '@store/LOAD_MY_STORES_SUCCESS'

export const LOAD_MY_RESTAURANTS_REQUEST = '@restaurant/LOAD_MY_RESTAURANTS_REQUEST'
export const LOAD_MY_RESTAURANTS_SUCCESS = '@restaurant/LOAD_MY_RESTAURANTS_SUCCESS'
export const LOAD_MY_RESTAURANTS_FAILURE = '@restaurant/LOAD_MY_RESTAURANTS_FAILURE'

export const SET_INTERNET_REACHABLE = '@app/SET_INTERNET_REACHABLE'

export const REGISTRATION_ERRORS = '@app/REGISTRATION_ERRORS'

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

export const logoutRequest = createAction(LOGOUT_REQUEST)
export const logoutSuccess = createAction(LOGOUT_SUCCESS)
export const setServers = createAction(SET_SERVERS)

const _setUser = createAction(SET_USER)
const setBaseURL = createAction(SET_BASE_URL)
const _setCurrentRoute = createAction(SET_CURRENT_ROUTE)
const _setSelectServerError = createAction(SET_SELECT_SERVER_ERROR)
const _clearSelectServerError = createAction(CLEAR_SELECT_SERVER_ERROR)

const _resumeCheckoutAfterActivation = createAction(RESUME_CHECKOUT_AFTER_ACTIVATION)

export const registerPushNotificationToken = createAction(REGISTER_PUSH_NOTIFICATION_TOKEN)
export const savePushNotificationTokenSuccess = createAction(SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS)
export const deletePushNotificationTokenSuccess = createAction(DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS)

const _loadMyStoresSuccess = createAction(LOAD_MY_STORES_SUCCESS)

const loadMyRestaurantsRequest = createAction(LOAD_MY_RESTAURANTS_REQUEST)
const loadMyRestaurantsSuccess = createAction(LOAD_MY_RESTAURANTS_SUCCESS)
const loadMyRestaurantsFailure = createAction(LOAD_MY_RESTAURANTS_FAILURE)

const setSettings = createAction(SET_SETTINGS)

export const setInternetReachable = createAction(SET_INTERNET_REACHABLE)

const registrationErrors = createAction(REGISTRATION_ERRORS)

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
        Settings.synchronize(baseURL)
          .then((settings) => {
            dispatch(setSettings(settings))
            if (settings.currency_code) {
              setCurrencyCode(settings.currency_code)
            }
          })
          .then(() => {

            const user = new AppUser(
              null,
              null,
              null,
              null,
              null,
              false
            )

            dispatch(_setUser(user))
            dispatch(setBaseURL(baseURL))

          })
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

  return async (dispatch, getState) => {

    const settings = await Settings.synchronize(baseURL)

    dispatch(setSettings(settings))
    if (settings.currency_code) {
      setCurrencyCode(settings.currency_code)
    }

    dispatch(_setUser(user))
    dispatch(setBaseURL(baseURL))

    setTimeout(() => navigateToHome(dispatch, getState), 250)
  }
}

export function setCurrentRoute(routeName) {

  return (dispatch, getState) => {
    dispatch(_setCurrentRoute(routeName))
    tracker.setCurrentScreen(routeName)
  }
}

export function login(email, password, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.login(email, password)
      .then(user => {
        onAuthenticationSuccess(user, dispatch, getState)

        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250)
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

  return async (dispatch, getState) => {

    const { user } = getState().app

    dispatch(logoutRequest())
    await user.logout()
    dispatch(logoutSuccess())
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
          onAuthenticationSuccess(user, dispatch, getState)

        } else {
          dispatch(setLoading(false))
          dispatch(_resumeCheckoutAfterActivation(resumeCheckoutAfterActivation))

          // FIXME When using navigation, we can still go back to the filled form
          NavigationHolder.navigate(checkEmailRouteName, { email: user.email, loginRouteName })
        }
      })
      .catch(err => {
        if (err.status === 400 && err.hasOwnProperty('errors')) {
          dispatch(registrationErrors(err.errors))
        } else {
          dispatch(authenticationFailure(i18n.t('TRY_LATER')))
        }
      })
  }
}

export function confirmRegistration(token) {
  return (dispatch, getState) => {
    const { app } = getState()
    const { httpClient, resumeCheckoutAfterActivation } = app

    dispatch(authenticationRequest())

    httpClient.confirmRegistration(token)
      .then(user => {
        onAuthenticationSuccess(user, dispatch, getState)

        if (resumeCheckoutAfterActivation) {
          dispatch(_resumeCheckoutAfterActivation(false))
        } else {
          navigateToHome(dispatch, getState)
        }
      })
      .catch(err => {
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
      .then(user => {
        onAuthenticationSuccess(user, dispatch, getState);

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
        dispatch(logoutRequest())
        await user.logout()
        dispatch(logoutSuccess())
      }

      dispatch(setBaseURL(null))

      NavigationHolder.navigate('ConfigureServer')
  }
}

function onAuthenticationSuccess(user, dispatch, getState) {
  dispatch(authenticationSuccess())
}
