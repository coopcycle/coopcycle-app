import { createAction } from '@reduxjs/toolkit';
import { createAction as createFsAction } from 'redux-actions';
import { CommonActions } from '@react-navigation/native';
import analyticsEvent from '../../analytics/Event';
import tracker from '../../analytics/Tracker';
import userProperty from '../../analytics/UserProperty';

import API from '../../API';
import AppUser from '../../AppUser';
import NavigationHolder from '../../NavigationHolder';
import Settings from '../../Settings';
import i18n from '../../i18n';
import { setCurrencyCode } from '../../utils/formatting';
import { loadAddresses, loadAddressesSuccess } from '../Account/actions';
import {
  assignAllCarts,
  clearAddress,
  setRestaurant,
  updateCarts,
} from '../Checkout/actions';
import { selectRestaurant } from '../Checkout/selectors';
import {
  selectHttpClient,
  selectInitialRouteName,
  selectIsAuthenticated,
  selectResumeCheckoutAfterActivation,
} from './selectors';

/*
 * Action Types
 */

export const SET_BASE_URL = 'SET_BASE_URL';
export const SET_HTTP_CLIENT = 'SET_HTTP_CLIENT';
export const SET_USER = 'SET_USER';
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';

export const REGISTER_PUSH_NOTIFICATION_TOKEN =
  '@app/REGISTER_PUSH_NOTIFICATION_TOKEN';
export const SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS =
  '@app/SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS';
export const DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS =
  '@app/DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS';

export const LOGIN = '@app/LOGIN';
export const SET_LOADING = '@app/SET_LOADING';

export const FOREGROUND_PUSH_NOTIFICATION = '@app/FOREGROUND_PUSH_NOTIFICATION';

export const ADD_NOTIFICATION = '@app/ADD_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = '@app/CLEAR_NOTIFICATIONS';

export const AUTHENTICATION_REQUEST = '@app/AUTHENTICATION_REQUEST';
export const AUTHENTICATION_SUCCESS = '@app/AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_FAILURE = '@app/AUTHENTICATION_FAILURE';
export const CLEAR_AUTHENTICATION_ERRORS = '@app/CLEAR_AUTHENTICATION_ERRORS';
export const RESET_PASSWORD_INIT = '@app/RESET_PASSWORD_INIT';
export const RESET_PASSWORD_REQUEST = '@app/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_REQUEST_SUCCESS =
  '@app/RESET_PASSWORD_REQUEST_SUCCESS';
export const RESET_PASSWORD_REQUEST_FAILURE =
  '@app/RESET_PASSWORD_REQUEST_FAILURE';
export const LOGOUT_REQUEST = '@app/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = '@app/LOGOUT_SUCCESS';
export const RESUME_CHECKOUT_AFTER_ACTIVATION =
  '@app/RESUME_CHECKOUT_AFTER_ACTIVATION';
export const SET_SERVERS = '@app/SET_SERVERS';
export const SET_SETTINGS = '@app/SET_SETTINGS';
export const SET_SELECT_SERVER_ERROR = '@app/SET_SELECT_SERVER_ERROR';
export const CLEAR_SELECT_SERVER_ERROR = '@app/CLEAR_SELECT_SERVER_ERROR';

export const LOAD_MY_STORES_SUCCESS = '@store/LOAD_MY_STORES_SUCCESS';

export const LOAD_MY_RESTAURANTS_REQUEST =
  '@restaurant/LOAD_MY_RESTAURANTS_REQUEST';
export const LOAD_MY_RESTAURANTS_SUCCESS =
  '@restaurant/LOAD_MY_RESTAURANTS_SUCCESS';
export const LOAD_MY_RESTAURANTS_FAILURE =
  '@restaurant/LOAD_MY_RESTAURANTS_FAILURE';

export const SET_INTERNET_REACHABLE = '@app/SET_INTERNET_REACHABLE';

export const REGISTRATION_ERRORS = '@app/REGISTRATION_ERRORS';
export const LOGIN_BY_EMAIL_ERRORS = '@app/LOGIN_BY_EMAIL_ERRORS';

export const SET_BACKGROUND_GEOLOCATION_ENABLED =
  '@app/SET_BACKGROUND_GEOLOCATION_ENABLED';
export const BACKGROUND_PERMISSION_DISCLOSED =
  '@app/BACKGROUND_PERMISSION_DISCLOSED';

export const SET_MODAL = '@app/SET_MODAL';
export const CLOSE_MODAL = '@app/CLOSE_MODAL';
export const RESET_MODAL = '@app/RESET_MODAL';
export const ONBOARDED = '@app/ONBOARDED';

export const ACCEPT_TERMS_AND_CONDITIONS = '@app/ACCEPT_TERMS_AND_CONDITIONS';
export const ACCEPT_PRIVACY_POLICY = '@app/ACCEPT_PRIVACY_POLICY';

export const LOAD_TERMS_AND_CONDITIONS_REQUEST =
  '@app/LOAD_TERMS_AND_CONDITIONS_REQUEST';
export const LOAD_TERMS_AND_CONDITIONS_SUCCESS =
  '@app/LOAD_TERMS_AND_CONDITIONS_SUCCESS';
export const LOAD_TERMS_AND_CONDITIONS_FAILURE =
  '@app/LOAD_TERMS_AND_CONDITIONS_FAILURE';

export const LOAD_PRIVACY_POLICY_REQUEST = '@app/LOAD_PRIVACY_POLICY_REQUEST';
export const LOAD_PRIVACY_POLICY_SUCCESS = '@app/LOAD_PRIVACY_POLICY_SUCCESS';
export const LOAD_PRIVACY_POLICY_FAILURE = '@app/LOAD_PRIVACY_POLICY_FAILURE';

export const SET_SPINNER_DELAY_ENABLED = '@app/SET_IS_SPINNER_DELAY_ENABLED';

/*
 * Action Creators
 */

export const setLoading = createFsAction(SET_LOADING);

export const foregroundPushNotification = createFsAction(
  FOREGROUND_PUSH_NOTIFICATION,
  (event, params = {}) => ({ event, params }),
);

export const addNotification = createFsAction(
  ADD_NOTIFICATION,
  (event, params = {}) => ({ event, params }),
);
export const clearNotifications = createFsAction(CLEAR_NOTIFICATIONS);

export const _authenticationRequest = createFsAction(AUTHENTICATION_REQUEST);
export const _authenticationSuccess = createFsAction(AUTHENTICATION_SUCCESS);
const _authenticationFailure = createFsAction(AUTHENTICATION_FAILURE);

export const clearAuthenticationErrors = createFsAction(
  CLEAR_AUTHENTICATION_ERRORS,
);

const resetPasswordInit = createFsAction(RESET_PASSWORD_INIT);
const resetPasswordRequest = createFsAction(RESET_PASSWORD_REQUEST);
const resetPasswordRequestSuccess = createFsAction(
  RESET_PASSWORD_REQUEST_SUCCESS,
);
const resetPasswordRequestFailure = createFsAction(
  RESET_PASSWORD_REQUEST_FAILURE,
);

export const logoutRequest = createFsAction(LOGOUT_REQUEST);
export const _logoutSuccess = createFsAction(LOGOUT_SUCCESS);
export const setServers = createFsAction(SET_SERVERS);

const setUser = createFsAction(SET_USER);
const _setBaseURL = createFsAction(SET_BASE_URL);
const _setCurrentRoute = createFsAction(SET_CURRENT_ROUTE);
const _setSelectServerError = createFsAction(SET_SELECT_SERVER_ERROR);
const _clearSelectServerError = createFsAction(CLEAR_SELECT_SERVER_ERROR);

const _resumeCheckoutAfterActivation = createFsAction(
  RESUME_CHECKOUT_AFTER_ACTIVATION,
);

export const registerPushNotificationToken = createFsAction(
  REGISTER_PUSH_NOTIFICATION_TOKEN,
);
export const savePushNotificationTokenSuccess = createFsAction(
  SAVE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
);
export const deletePushNotificationTokenSuccess = createFsAction(
  DELETE_PUSH_NOTIFICATION_TOKEN_SUCCESS,
);

const _loadMyStoresSuccess = createFsAction(LOAD_MY_STORES_SUCCESS);

const loadMyRestaurantsRequest = createFsAction(LOAD_MY_RESTAURANTS_REQUEST);
const loadMyRestaurantsSuccess = createFsAction(LOAD_MY_RESTAURANTS_SUCCESS);
const loadMyRestaurantsFailure = createFsAction(LOAD_MY_RESTAURANTS_FAILURE);

const setSettings = createFsAction(SET_SETTINGS);

export const setInternetReachable = createFsAction(SET_INTERNET_REACHABLE);

export const setBackgroundGeolocationEnabled = createFsAction(
  SET_BACKGROUND_GEOLOCATION_ENABLED,
);
export const backgroundPermissionDisclosed = createFsAction(
  BACKGROUND_PERMISSION_DISCLOSED,
);

export const setModal = createFsAction(SET_MODAL);
export const resetModal = createFsAction(RESET_MODAL);
export const closeModal = createFsAction(CLOSE_MODAL);
export const onboarded = createFsAction(ONBOARDED);

export const acceptTermsAndConditions = createFsAction(
  ACCEPT_TERMS_AND_CONDITIONS,
);
export const acceptPrivacyPolicy = createFsAction(ACCEPT_PRIVACY_POLICY);

const loadTermsAndConditionsRequest = createFsAction(
  LOAD_TERMS_AND_CONDITIONS_REQUEST,
);
const loadTermsAndConditionsSuccess = createFsAction(
  LOAD_TERMS_AND_CONDITIONS_SUCCESS,
);
const loadTermsAndConditionsFailure = createFsAction(
  LOAD_TERMS_AND_CONDITIONS_FAILURE,
);

const loadPrivacyPolicyRequest = createFsAction(LOAD_PRIVACY_POLICY_REQUEST);
const loadPrivacyPolicySuccess = createFsAction(LOAD_PRIVACY_POLICY_SUCCESS);
const loadPrivacyPolicyFailure = createFsAction(LOAD_PRIVACY_POLICY_FAILURE);

const registrationErrors = createFsAction(REGISTRATION_ERRORS);
const loginByEmailErrors = createFsAction(LOGIN_BY_EMAIL_ERRORS);

export const setSpinnerDelayEnabled = createFsAction(SET_SPINNER_DELAY_ENABLED);

export const startSound = createAction('START_SOUND');
export const stopSound = createAction('STOP_SOUND');

function setBaseURL(baseURL) {
  return (dispatch, getState) => {
    dispatch(_setBaseURL(baseURL));
    tracker.setUserProperty(userProperty.server, baseURL);
  };
}

function authenticationRequest() {
  return (dispatch, getState) => {
    dispatch(clearAuthenticationErrors());
    dispatch(_authenticationRequest());
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.submit,
    );
  };
}

function authenticationSuccess(user) {
  return async (dispatch, getState) => {
    await dispatch(loadAddresses());
    await dispatch(assignAllCarts());

    setRolesProperty(user);
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.success,
    );

    dispatch(_authenticationSuccess());
  };
}

export function authenticationFailure(message) {
  return (dispatch, getState) => {
    dispatch(_authenticationFailure(message));
    tracker.logEvent(
      analyticsEvent.user.login._category,
      analyticsEvent.user.login.failure,
    );
  };
}

function logoutSuccess() {
  return (dispatch, getState) => {
    dispatch(_logoutSuccess());
    dispatch(updateCarts({}));
    setRolesProperty(null);
  };
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
    tracker.setUserProperty(userProperty.roles, roles.toString());
  } else {
    tracker.setUserProperty(userProperty.roles, DEFAULT_ROLE);
  }
}

function navigateToHome(dispatch, getState) {
  dispatch(loadMyRestaurantsRequest());

  loadAll(getState).then(values => {
    const [restaurants, stores] = values;

    dispatch(loadMyRestaurantsSuccess(restaurants));
    if (stores) {
      dispatch(_loadMyStoresSuccess(stores));
    }

    NavigationHolder.navigate(selectInitialRouteName(getState()));
  });
}

function loadAll(getState) {
  const defaultValues = [[], []];

  return new Promise(resolve => {
    const { httpClient, user } = getState().app;

    if (user && user.isAuthenticated()) {
      if (
        user.hasRole('ROLE_ADMIN') ||
        user.hasRole('ROLE_RESTAURANT') ||
        user.hasRole('ROLE_STORE')
      ) {
        const promises = [];

        promises.push(
          new Promise((resolve, reject) => {
            if (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) {
              const req = user.hasRole('ROLE_ADMIN')
                ? httpClient.get('/api/restaurants')
                : httpClient.get('/api/me/restaurants');
              req
                .then(res => {
                  resolve(res['hydra:member']);
                })
                .catch(e => {
                  resolve([]);
                });
            } else {
              resolve([]);
            }
          }),
        );
        promises.push(
          new Promise((resolve, reject) => {
            if (user.hasRole('ROLE_STORE')) {
              const req = httpClient.get('/api/me/stores');
              req
                .then(res => {
                  resolve(res['hydra:member']);
                })
                .catch(e => {
                  resolve([]);
                });
            } else {
              resolve([]);
            }
          }),
        );

        Promise.all(promises).then(values => {
          resolve(values);
        });
      } else {
        resolve(defaultValues);
      }
    } else {
      resolve(defaultValues);
    }
  });
}

export function selectServer(server) {
  return function (dispatch, getState) {
    dispatch(setLoading(true));
    dispatch(_clearSelectServerError());

    return API.checkServer(server)
      .then(baseURL =>
        Settings.synchronize(baseURL)
          .then(settings => {
            dispatch(setSettings(settings));
            if (settings.currency_code) {
              setCurrencyCode(settings.currency_code);
            }
          })
          .then(() => {
            const user = new AppUser(null, null, null, null, null, false);

            dispatch(setUser(user));
            dispatch(setBaseURL(baseURL));
          })
          .then(() => dispatch(_clearSelectServerError()))
          .then(() => dispatch(setLoading(false))),
      )
      .catch(err => {
        setTimeout(() => {
          const message = err.message ? err.message : i18n.t('TRY_LATER');
          dispatch(setLoading(false));
          dispatch(_setSelectServerError(message));
        }, 500);
      });
  };
}

export function bootstrap(baseURL, user, loader = true) {
  return async (dispatch, getState) => {
    const settings = await Settings.synchronize(baseURL);

    dispatch(setSettings(settings));
    if (settings.currency_code) {
      setCurrencyCode(settings.currency_code);
    }

    dispatch(setUser(user));
    dispatch(setBaseURL(baseURL));
    setRolesProperty(user);

    const httpClient = getState().app.httpClient;

    try {
      // We check if the token is still valid
      // If not, the user will be disconnected
      if (selectIsAuthenticated(getState())) {
        const me = await httpClient.get('/api/me');
        dispatch(loadAddressesSuccess(me.addresses));
      }

      if (loader) {
        dispatch(loadMyRestaurantsRequest());
      }

      const values = await loadAll(getState);

      const [restaurants, stores] = values;

      dispatch(loadMyRestaurantsSuccess(restaurants));
      if (stores) {
        dispatch(_loadMyStoresSuccess(stores));
      }
    } catch (e) {
      // Make sure it's actually a HTTP 401 error,
      // to avoid disconnecting users with other issues (network issues...)
      // https://axios-http.com/docs/handling_errors
      if (e.response && e.response.status === 401) {
        dispatch(logout());
      }
    }
  };
}

export function setCurrentRoute(routeName) {
  return (dispatch, getState) => {
    dispatch(_setCurrentRoute(routeName));
    tracker.setCurrentScreen(routeName);
  };
}

export function login(email, password, navigate = true) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(authenticationRequest());

    httpClient
      .login(email, password)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250);
        }
      })
      .catch(err => {
        if (err.hasOwnProperty('code') && err.code === 401) {
          dispatch(
            loginByEmailErrors({
              email: i18n.t('INVALID_USER_PASS'),
              password: i18n.t('INVALID_USER_PASS'),
            }),
          );
        } else {
          dispatch(authenticationFailure(i18n.t('TRY_LATER')));
        }
      });
  };
}

export function logout() {
  return async (dispatch, getState) => {
    const { user } = getState().app;

    dispatch(logoutRequest());
    await user.logout();
    dispatch(logoutSuccess());
  };
}

export function register(
  data,
  checkEmailRouteName,
  loginRouteName,
  resumeCheckoutAfterActivation = false,
) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(authenticationRequest());

    httpClient
      .register(data)
      .then(user => {
        // Registration may require email confirmation.
        // If the user is enabled, we login immediately.
        // otherwise we wait for confirmation (via deep linking)
        if (user.enabled) {
          dispatch(authenticationSuccess(user));
        } else {
          dispatch(setLoading(false));

          if (resumeCheckoutAfterActivation) {
            const restaurant = selectRestaurant(getState());
            dispatch(_resumeCheckoutAfterActivation(restaurant['@id']));
          }

          // FIXME When using navigation, we can still go back to the filled form
          NavigationHolder.navigate(checkEmailRouteName, {
            email: user.email,
            loginRouteName,
          });
        }
      })
      .catch(err => {
        if (err.status === 400 && err.hasOwnProperty('errors')) {
          dispatch(registrationErrors(err.errors));
        } else {
          dispatch(authenticationFailure(i18n.t('TRY_LATER')));
        }
      });
  };
}

export function confirmRegistration(token) {
  return (dispatch, getState) => {
    const httpClient = selectHttpClient(getState());
    const checkoutToResumeAfterActivation = selectResumeCheckoutAfterActivation(
      getState(),
    );

    dispatch(authenticationRequest());

    httpClient
      .confirmRegistration(token)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        //remove RegisterConfirmScreen from stack
        NavigationHolder.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AccountHome' }],
          }),
        );

        if (checkoutToResumeAfterActivation) {
          dispatch(resumeCheckout(checkoutToResumeAfterActivation));
        } else {
          navigateToHome(dispatch, getState);
        }
      })
      .catch(err => {
        dispatch(setLoading(false));
        if (err.hasOwnProperty('status') && err.status === 401) {
          // TODO Say that the token is no valid
        }
      });
  };
}

export function forgotPassword() {
  return (dispatch, getState) => {
    dispatch(resetPasswordInit());
  };
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
    );
    dispatch(setUser(user));
    console.log('User is in guest mode');
  };
}

function resumeCheckout(vendorId) {
  return (dispatch, getState) => {
    dispatch(_resumeCheckoutAfterActivation(null));

    dispatch(setRestaurant(vendorId));

    NavigationHolder.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: 'CheckoutNav',
            state: {
              routes: [
                {
                  name: 'Main',
                  state: {
                    routes: [
                      { name: 'CheckoutHome' },
                      {
                        name: 'CheckoutRestaurant',
                      },
                      {
                        name: 'CheckoutSummary',
                      },
                    ],
                  },
                },
                {
                  name: 'CheckoutSubmitOrder',
                  state: {
                    routes: [{ name: 'CheckoutMoreInfos' }],
                  },
                },
              ],
            },
          },
        ],
      }),
    );
  };
}

export function resetPassword(
  username,
  checkEmailRouteName,
  resumeCheckoutAfterActivation,
) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(resetPasswordRequest());

    httpClient
      .resetPassword(username)
      .then(response => {
        dispatch(resetPasswordRequestSuccess());

        if (resumeCheckoutAfterActivation) {
          const restaurant = selectRestaurant(getState());
          dispatch(_resumeCheckoutAfterActivation(restaurant['@id']));
        }

        NavigationHolder.navigate(checkEmailRouteName, { email: username });
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        dispatch(resetPasswordRequestFailure(message));
      });
  };
}

export function setNewPassword(token, password) {
  return (dispatch, getState) => {
    const httpClient = selectHttpClient(getState());
    const checkoutToResumeAfterActivation = selectResumeCheckoutAfterActivation(
      getState(),
    );

    dispatch(authenticationRequest());

    httpClient
      .setNewPassword(token, password)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        if (checkoutToResumeAfterActivation) {
          dispatch(resumeCheckout(checkoutToResumeAfterActivation));
        } else {
          navigateToHome(dispatch, getState);
        }
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');

        if (err.hasOwnProperty('status')) {
          switch (err.status) {
            case 400:
              message = i18n.t('RESET_PASSWORD_LINK_EXPIRED');
              break;
            case 401:
              message = i18n.t('AN_ERROR_OCCURRED');
              break;
          }
        }

        dispatch(authenticationFailure(message));
      });
  };
}

export function resetServer() {
  return async (dispatch, getState) => {
    const { user } = getState().app;

    if (user) {
      dispatch(logoutRequest());
      await user.logout();
      dispatch(logoutSuccess());
    }

    dispatch(clearAddress());
    dispatch(setBaseURL(null));
  };
}

export function loginWithFacebook(accessToken, navigate = true) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(authenticationRequest());

    httpClient
      .loginWithFacebook(accessToken)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250);
        }
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', {
            provider: 'Facebook',
          });
        }

        dispatch(authenticationFailure(message));
      });
  };
}

export function signInWithApple(identityToken, navigate = true) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(authenticationRequest());

    httpClient
      .signInWithApple(identityToken)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250);
        }
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', {
            provider: 'Apple',
          });
        }

        dispatch(authenticationFailure(message));
      });
  };
}

export function googleSignIn(idToken, navigate = true) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(authenticationRequest());

    httpClient
      .googleSignIn(idToken)
      .then(user => dispatch(authenticationSuccess(user)))
      .then(() => {
        if (navigate) {
          // FIXME
          // Use setTimeout() to let room for loader to hide
          setTimeout(() => navigateToHome(dispatch, getState), 250);
        }
      })
      .catch(err => {
        let message = i18n.t('TRY_LATER');
        if (err.hasOwnProperty('status') && err.status === 403) {
          message = i18n.t('SOCIAL_SIGN_IN_UNKNOWN_EMAIL', {
            provider: 'Google',
          });
        }

        dispatch(authenticationFailure(message));
      });
  };
}

export function loadTermsAndConditions(lang) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(loadTermsAndConditionsRequest());

    httpClient
      .get(`/${lang}/terms-text`)
      .then(res => {
        dispatch(loadTermsAndConditionsSuccess(res.text));
      })
      .catch(_ => {
        const message = i18n.t('TRY_LATER');
        dispatch(loadTermsAndConditionsFailure(message));
      });
  };
}

export function loadPrivacyPolicy(lang) {
  return (dispatch, getState) => {
    const { app } = getState();
    const { httpClient } = app;

    dispatch(loadPrivacyPolicyRequest());

    httpClient
      .get(`/${lang}/privacy-text`)
      .then(res => {
        dispatch(loadPrivacyPolicySuccess(res.text));
      })
      .catch(_ => {
        const message = i18n.t('TRY_LATER');
        dispatch(loadPrivacyPolicyFailure(message));
      });
  };
}
