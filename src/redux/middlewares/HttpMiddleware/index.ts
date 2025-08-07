import { createAction } from 'redux-actions';

import API from '../../../API';
import AppUser from '../../../AppUser';

import { SET_HTTP_CLIENT, SET_USER, setModal } from '../../App/actions';
import { selectIsAuthenticated, selectUser } from '../../App/selectors';

const setHttpClient = createAction(SET_HTTP_CLIENT);
export const setUser = createAction(SET_USER);

export default ({ getState, dispatch }) => {
  return next => action => {
    const prevState = getState();
    const result = next(action);
    const state = getState();

    const hasBaseURLChanged = prevState.app.baseURL !== state.app.baseURL;
    const hasUserChanged = selectUser(prevState) !== selectUser(state);
    const hasAuthenticationChanged =
      selectIsAuthenticated(prevState) !== selectIsAuthenticated(state);

    if (hasBaseURLChanged || hasUserChanged || hasAuthenticationChanged) {
      if (state.app.baseURL) {
        const httpClient = API.createClient(state.app.baseURL, {
          token: selectUser(state) ? selectUser(state).token : '',
          refreshToken: selectUser(state) ? selectUser(state).refreshToken : '',
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
            const { username, email, roles, enabled } = selectUser(state);

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
          onMaintenance: message => {
            if (message) {
              dispatch(
                setModal({
                  show: true,
                  skippable: false,
                  content: message,
                }),
              );
            }
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
