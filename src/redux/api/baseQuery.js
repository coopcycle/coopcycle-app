import VersionNumber from 'react-native-version-number';
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { selectBaseURL, selectUser } from '../App/selectors';
import { Mutex } from 'async-mutex';
import qs from 'qs';
import AppUser from '../../AppUser';
import { logout } from '../App/actions';
import { setUser } from '../middlewares/HttpMiddleware'

const guestCheckoutEndpoints = [
  'getOrderValidate',
  'getOrderTiming',
  'updateOrder',
];

const appVersion =
  VersionNumber.bundleIdentifier +
  '@' +
  VersionNumber.appVersion +
  ' (' +
  VersionNumber.buildVersion +
  ')';

// create a new mutex
const mutex = new Mutex();

const buildBaseQuery = (baseUrl, anonymous = false) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set('X-Application-Version', appVersion);

      if (!anonymous) {
        const user = selectUser(getState());
        if (user) {
          headers.set('Authorization', `Bearer ${user.token}`);
        } else if (guestCheckoutEndpoints.includes(endpoint)) {
          //todo
          // const orderAccessToken = selectOrderAccessToken(getState())
          //
          // if (orderAccessToken) {
          //   headers.set('Authorization', `Bearer ${orderAccessToken}`)
          // }
        }
      }

      return headers;
    },
    jsonContentType: 'application/ld+json',
    timeout: 30000,
  });
};

//based on https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  const { getState } = api;

  const baseUrl = selectBaseURL(getState()) + '/';
  const baseQuery = buildBaseQuery(baseUrl);

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const user = selectUser(getState());

    if (!user) {
      return result;
    }

    const refreshToken = user.refreshToken;

    // checking whether the mutex is locked
    if (mutex.isLocked()) {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        // try to get a new token
        const refreshResult = await buildBaseQuery(baseUrl, true)(
          {
            url: '/api/token/refresh',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
              refresh_token: refreshToken,
            }),
          },
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          const { token, refresh_token } = refreshResult.data;

          const { username, email, roles, enabled } = user;

          const updUser = new AppUser(
            username,
            email,
            token,
            roles,
            refresh_token,
            enabled,
          );

          // store the new token
          api.dispatch(setUser(updUser));
          await user.save();
          console.log('Credentials saved!')

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    }
  }
  return result;
};
