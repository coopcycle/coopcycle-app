import { createAction } from 'redux-actions';

import API from '../../../API';
import AppUser from '../../../AppUser';

import { SET_HTTP_CLIENT, SET_USER } from '../../App/actions';
import { selectIsAuthenticated } from '../../App/selectors';

const setHttpClient = createAction(SET_HTTP_CLIENT);
const setUser = createAction(SET_USER);

export default ({ getState, dispatch }) => {
  return next => action => {
    const prevState = getState();
    const result = next(action);
    const state = getState();

    const hasBaseURLChanged = prevState.app.baseURL !== state.app.baseURL;
    const hasUserChanged = prevState.app.user !== state.app.user;
    const hasAuthenticationChanged =
      selectIsAuthenticated(prevState) !== selectIsAuthenticated(state);

    if (hasBaseURLChanged || hasUserChanged || hasAuthenticationChanged) {
      if (state.app.baseURL) {
        const httpClient = API.createClient(state.app.baseURL, {
          token: state.app.user ? state.app.user.token : '',
          refreshToken: state.app.user ? state.app.user.refreshToken : '',
          onCredentialsUpdated: credentials => {
            const user = new AppUser(
              credentials.username,
              credentials.email,
              credentials.token,
              credentials.roles,
              credentials.refreshToken,
              credentials.enabled,
            );

            dispatch(setUser(user));

            user.save().then(() => console.log('Credentials saved!'));
          },
          onTokenRefreshed: (token, refreshToken) => {
            const { username, email, roles, enabled } = state.app.user;

            const user = new AppUser(
              username,
              email,
              token,
              roles,
              refreshToken,
              enabled,
            );

            dispatch(setUser(user));

            user.save().then(() => console.log('Credentials saved!'));
          },
        });

        dispatch(setHttpClient(httpClient));
      } else {
        dispatch(setHttpClient(null));
      }
    }

    return result;
  };
};
