import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { selectBaseURL, selectLoggedInUser } from '../App/selectors';
import { Mutex } from 'async-mutex';
import qs from 'qs';
import AppUser from '../../AppUser';
import { logout, setModal } from '../App/actions';
import { setUser } from '../middlewares/HttpMiddleware';
import { selectCart } from '../Checkout/selectors';
import { defaultHeaders } from '../../utils/headers';

const guestCheckoutEndpoints = [
  'getOrderValidate',
  'getOrderTiming',
  'updateOrder',
];

// create a new mutex
const mutex = new Mutex();

const buildBaseQuery = (baseUrl, anonymous = false) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      for (const [key, value] of Object.entries(defaultHeaders())) {
        headers.set(key, value);
      }

      if (!anonymous) {
        const loggedInUser = selectLoggedInUser(getState());

        if (guestCheckoutEndpoints.includes(endpoint)) {
          const { cart, token: orderAccessToken } = selectCart(getState());

          if (loggedInUser && cart.customer) {
            headers.set('Authorization', `Bearer ${loggedInUser.token}`);
          } else if (orderAccessToken) {
            headers.set('Authorization', `Bearer ${orderAccessToken}`);
          } else {
            console.warn(
              `No token found for endpoint ${endpoint} (guestCheckoutEndpoints)`,
            );
          }
        } else {
          if (loggedInUser) {
            headers.set('Authorization', `Bearer ${loggedInUser.token}`);
          } else {
            console.warn(`No token found for endpoint ${endpoint}`);
          }
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

  if (result.error) {
    if (result.error.status === 401) {
      const loggedInUser = selectLoggedInUser(getState());

      if (!loggedInUser) {
        return result;
      }

      const refreshToken = loggedInUser.refreshToken;

      if (mutex.isLocked()) {
        // wait for the mutex release, i.e. wait that another request that needed a fresh token gets the new token for us and update the state accordingly
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

            const { username, email, roles, enabled } = loggedInUser;

            const updUser = new AppUser(
              username,
              email,
              token,
              roles,
              refresh_token,
              enabled,
            );

            // store the new token
            api.dispatch(setUser({...updUser}));
            await updUser.save();
            console.log('Credentials saved!');

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
    } else if (result.error.status === 503) {
      const message = result.error.data.message;
      if (message) {
        api.dispatch(
          setModal({
            show: true,
            skippable: false,
            content: message,
          }),
        );
      }
    }
  }
  return result;
};
