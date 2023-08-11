import { createAction } from 'redux-actions'
import { CommonActions, StackActions } from '@react-navigation/native'
import tracker from '../../analytics/Tracker'
import analyticsEvent from '../../analytics/Event'
import userProperty from '../../analytics/UserProperty'

import API from '../../API'
import AppUser from '../../AppUser'
import Settings from '../../Settings'
import NavigationHolder from '../../NavigationHolder'
import i18n from '../../i18n'
import { setCurrencyCode } from '../../utils/formatting'
import { selectInitialRouteName, selectIsAuthenticated } from './selectors'
import { assignAllCarts, updateCarts } from '../Checkout/actions';
import { loadAddresses, loadAddressesSuccess } from '../Account/actions';

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

export const SET_BACKGROUND_GEOLOCATION_ENABLED = '@app/SET_BACKGROUND_GEOLOCATION_ENABLED'
export const BACKGROUND_PERMISSION_DISCLOSED = '@app/BACKGROUND_PERMISSION_DISCLOSED'

export const SET_MODAL = '@app/SET_MODAL'
export const CLOSE_MODAL = '@app/CLOSE_MODAL'
export const RESET_MODAL = '@app/RESET_MODAL'
export const ONBOARDED = '@app/ONBOARDED'

export const ACCEPT_TERMS_AND_CONDITIONS = '@app/ACCEPT_TERMS_AND_CONDITIONS'
export const ACCEPT_PRIVACY_POLICY = '@app/ACCEPT_PRIVACY_POLICY'

export const LOAD_TERMS_AND_CONDITIONS_REQUEST = '@app/LOAD_TERMS_AND_CONDITIONS_REQUEST'
export const LOAD_TERMS_AND_CONDITIONS_SUCCESS = '@app/LOAD_TERMS_AND_CONDITIONS_SUCCESS'
export const LOAD_TERMS_AND_CONDITIONS_FAILURE = '@app/LOAD_TERMS_AND_CONDITIONS_FAILURE'

export const LOAD_PRIVACY_POLICY_REQUEST = '@app/LOAD_PRIVACY_POLICY_REQUEST'
export const LOAD_PRIVACY_POLICY_SUCCESS = '@app/LOAD_PRIVACY_POLICY_SUCCESS'
export const LOAD_PRIVACY_POLICY_FAILURE = '@app/LOAD_PRIVACY_POLICY_FAILURE'

/*
 * Action Creators
 */

export const setLoading = createAction(SET_LOADING)
export const pushNotification = createAction(PUSH_NOTIFICATION, (event, params = {}) => ({ event, params }))
export const clearNotifications = createAction(CLEAR_NOTIFICATIONS)

export const _authenticationRequest = createAction(AUTHENTICATION_REQUEST)
export const _authenticationSuccess = createAction(AUTHENTICATION_SUCCESS)
const _authenticationFailure = createAction(AUTHENTICATION_FAILURE)

const resetPasswordInit = createAction(RESET_PASSWORD_INIT)
const resetPasswordRequest = createAction(RESET_PASSWORD_REQUEST)
const resetPasswordRequestSuccess = createAction(RESET_PASSWORD_REQUEST_SUCCESS)
const resetPasswordRequestFailure = createAction(RESET_PASSWORD_REQUEST_FAILURE)

export const logoutRequest = createAction(LOGOUT_REQUEST)
export const _logoutSuccess = createAction(LOGOUT_SUCCESS)
export const setServers = createAction(SET_SERVERS)

const setUser = createAction(SET_USER)
const _setBaseURL = createAction(SET_BASE_URL)
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

export const setBackgroundGeolocationEnabled = createAction(SET_BACKGROUND_GEOLOCATION_ENABLED)
export const backgroundPermissionDisclosed = createAction(BACKGROUND_PERMISSION_DISCLOSED)

export const setModal = createAction(SET_MODAL)
export const resetModal = createAction(RESET_MODAL)
export const closeModal = createAction(CLOSE_MODAL)
export const onboarded = createAction(ONBOARDED)

export const acceptTermsAndConditions = createAction(ACCEPT_TERMS_AND_CONDITIONS)
export const acceptPrivacyPolicy = createAction(ACCEPT_PRIVACY_POLICY)

const loadTermsAndConditionsRequest = createAction(LOAD_TERMS_AND_CONDITIONS_REQUEST)
const loadTermsAndConditionsSuccess = createAction(LOAD_TERMS_AND_CONDITIONS_SUCCESS)
const loadTermsAndConditionsFailure = createAction(LOAD_TERMS_AND_CONDITIONS_FAILURE)

const loadPrivacyPolicyRequest = createAction(LOAD_PRIVACY_POLICY_REQUEST)
const loadPrivacyPolicySuccess = createAction(LOAD_PRIVACY_POLICY_SUCCESS)
const loadPrivacyPolicyFailure = createAction(LOAD_PRIVACY_POLICY_FAILURE)

const registrationErrors = createAction(REGISTRATION_ERRORS)

function setBaseURL(baseURL) {
  return (dispatch, getState) => {
    dispatch(_setBaseURL(baseURL))
    tracker.setUserProperty(
      userProperty.server,
      baseURL)
  }
}

function authenticationRequest() {
  return (dispatch, getState) => {
    dispatch(_authenticationRequest())
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.submit)
  }
}

function authenticationSuccess(user) {
  return (dispatch, getState) => {
    dispatch(setLoading(true))
    dispatch(_authenticationSuccess())
    dispatch(loadAddresses())
    dispatch(assignAllCarts())
    dispatch(setLoading(false))
    setRolesProperty(user)
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.success)
  }
}

export function authenticationFailure(message) {
  return (dispatch, getState) => {
    dispatch(_authenticationFailure(message))
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.failure)
  }
}

function logoutSuccess() {
  return (dispatch, getState) => {
    dispatch(_logoutSuccess())
    dispatch(updateCarts({}))
    setRolesProperty(null)
  }
}

function setRolesProperty(user) {
  let roles;
  if (user !== null && user.roles !== null) {
    roles = user.roles.slice();
    roles.sort();

  } else {
    roles = [];
  }

  let DEFAULT_ROLE = 'ROLE_USER';

  if (roles.length > 0) {
    tracker.setUserProperty(
      userProperty.roles,
      roles.toString());
  } else {
    tracker.setUserProperty(
      userProperty.roles,
      DEFAULT_ROLE);
  }
}

function navigateToHome(dispatch, getState) {

  dispatch(loadMyRestaurantsRequest())

  loadAll(getState).then(values => {
    const [ restaurants, stores ] = values

    dispatch(loadMyRestaurantsSuccess(restaurants))
    if (stores) {
      dispatch(_loadMyStoresSuccess(stores))
    }

    NavigationHolder.navigate(selectInitialRouteName(getState()))
  })
}

function loadAll(getState) {

  const defaultValues = [
    [], [],
  ]

  return new Promise((resolve) => {

    const { httpClient, user } = getState().app

    if (user && user.isAuthenticated()) {

      if (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT') || user.hasRole('ROLE_STORE')) {

        const promises = []

        promises.push(new Promise((resolve, reject) => {
          if (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) {
            const req = user.hasRole('ROLE_ADMIN') ?
              httpClient.get('/api/restaurants') : httpClient.get('/api/me/restaurants')
            req
              .then(res => {
                resolve(res['hydra:member'])
              })
              .catch(e => {
                resolve([])
              })
          } else {
            resolve([])
          }
        }))
        promises.push(new Promise((resolve, reject) => {
          if (user.hasRole('ROLE_STORE')) {
            const req = httpClient.get('/api/me/stores')
            req
              .then(res => {
                resolve(res['hydra:member'])
              })
              .catch(e => {
                resolve([])
              })
          } else {
            resolve([])
          }
        }))

        Promise.all(promises)
          .then(values => {
            resolve(values)
          })
      } else {
        resolve(defaultValues)
      }
    } else {
      resolve(defaultValues)
    }
  })
}

export function selectServer(server) {

  return function (dispatch, getState) {

    dispatch(setLoading(true))
    dispatch(_clearSelectServerError())

    return API.checkServer(server)
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

            dispatch(setUser(user))
            dispatch(setBaseURL(baseURL))

          })
          .then(() => dispatch(_clearSelectServerError()))
          .then(() => dispatch(setLoading(false)))
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

export function bootstrap(baseURL, user, loader = true) {

  return async (dispatch, getState) => {

    const settings = await Settings.synchronize(baseURL)

    dispatch(setSettings(settings))
    if (settings.currency_code) {
      setCurrencyCode(settings.currency_code)
    }

    dispatch(setUser(user))
    dispatch(setBaseURL(baseURL))
    setRolesProperty(user)

    const httpClient = getState().app.httpClient

    try {

      // We check if the token is still valid
      // If not, the user will be disconnected
      if (selectIsAuthenticated(getState())) {
        const me = await httpClient.get('/api/me')
        dispatch(loadAddressesSuccess(me.addresses))
      }

      if (loader) {
        dispatch(loadMyRestaurantsRequest())
      }

      const values = await loadAll(getState)

      const [ restaurants, stores ] = values

      dispatch(loadMyRestaurantsSuccess(restaurants))
      if (stores) {
        dispatch(_loadMyStoresSuccess(stores))
      }

    } catch (e) {
      // Make sure it's actually a HTTP 401 error,
      // to avoid disconnecting users with other issues (network issues...)
      // https://axios-http.com/docs/handling_errors
      if (e.response && e.response.status === 401) {
        dispatch(logout())
      }
    }
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
        dispatch(authenticationSuccess(user));
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
          dispatch(authenticationSuccess(user))

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

    dispatch(setLoading(true))
    dispatch(authenticationRequest())

    httpClient.confirmRegistration(token)
      .then(user => {
        dispatch(authenticationSuccess(user))

        //remove RegisterConfirmScreen from stack
        NavigationHolder.dispatch(CommonActions.reset({
          index: 0,
          routes: [
            { name: 'AccountHome' },
          ],
        }))

        if (resumeCheckoutAfterActivation) {
          dispatch(resumeCheckout())
        } else {
          navigateToHome(dispatch, getState)
        }
      })
      .catch(err => {
        dispatch(setLoading(false))
        if (err.hasOwnProperty('status') && err.status === 401) {
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

export function guestModeOn() {
  return function (dispatch, getState) {
    const user = new AppUser(
      null, // username
      null, // email
      null, // token
      null, // roles
      null, // refresh token
      true, // enabled
      true, // guest
    )
    dispatch(setUser(user))
    console.log('User is in guest mode')
  }
}

export function resumeCheckout() {
  return (dispatch, getState) => {
    dispatch(_resumeCheckoutAfterActivation(false))
    NavigationHolder.dispatch(CommonActions.navigate({
      name: 'CheckoutNav',
    }))
  }
}

export function resetPassword(username, checkEmailRouteName, resumeCheckoutAfterActivation) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(resetPasswordRequest())

    httpClient
      .resetPassword(username)
      .then(response => {
        dispatch(resetPasswordRequestSuccess());
        dispatch(_resumeCheckoutAfterActivation(resumeCheckoutAfterActivation));

        NavigationHolder.navigate(checkEmailRouteName, { email: username });
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        dispatch(resetPasswordRequestFailure(message))
      });
  };
}

export function setNewPassword(token, password) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient, resumeCheckoutAfterActivation } = app;

    dispatch(authenticationRequest());

    httpClient
      .setNewPassword(token, password)
      .then(user => {
        dispatch(authenticationSuccess(user));

        if (resumeCheckoutAfterActivation) {
          dispatch(resumeCheckout());
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
  }
}

export function loginWithFacebook(accessToken, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.loginWithFacebook(accessToken)
      .then(user => {

        dispatch(authenticationSuccess(user));

        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250)
        }
      })
      .catch(err => {

        let message = i18n.t('TRY_LATER')
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', { provider: 'Facebook' })
        }

        dispatch(authenticationFailure(message))

      })
  }
}

export function signInWithApple(identityToken, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.signInWithApple(identityToken)
      .then(user => {

        dispatch(authenticationSuccess(user));

        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250)
        }
      })
      .catch(err => {

        let message = i18n.t('TRY_LATER')
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', { provider: 'Apple' })
        }

        dispatch(authenticationFailure(message))

      })
  }
}

export function googleSignIn(idToken, navigate = true) {

  return (dispatch, getState) => {

    const { app } = getState()
    const { httpClient } = app

    dispatch(authenticationRequest())

    httpClient.googleSignIn(idToken)
      .then(user => {

        dispatch(authenticationSuccess(user));

        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250)
        }
      })
      .catch(err => {

        let message = i18n.t('TRY_LATER')
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', { provider: 'Google' })
        }

        dispatch(authenticationFailure(message))

      })
  }
}

export function loadTermsAndConditions(lang) {

  return (dispatch, getState) => {
    const { app } = getState()
    const { httpClient } = app

    dispatch(loadTermsAndConditionsRequest())

    httpClient.get(`/${lang}/terms-text`)
      .then((res) => {
        dispatch(loadTermsAndConditionsSuccess(res.text))
      })
      .catch(_ => {
        const message = i18n.t('TRY_LATER')
        dispatch(loadTermsAndConditionsFailure(message))
      })
  }
}

export function loadPrivacyPolicy(lang) {

  return (dispatch, getState) => {
    const { app } = getState()
    const { httpClient } = app

    dispatch(loadPrivacyPolicyRequest())

    httpClient.get(`/${lang}/privacy-text`)
      .then((res) => {
        dispatch(loadPrivacyPolicySuccess(res.text))
      })
      .catch(_ => {
        const message = i18n.t('TRY_LATER')
        dispatch(loadPrivacyPolicyFailure(message))
      })
  }
}
