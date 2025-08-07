import { createAction } from 'redux-actions';

import AppUser from '../../../AppUser';

import { SET_USER, setModal } from '../../App/actions';
import { selectIsAuthenticated, selectUser } from '../../App/selectors';
import { httpClientService } from '../../../services/httpClientService';

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
        const user = selectUser(state);

        httpClientService.updateClient(
          state.app.baseURL,
          user ? user.token : '',
          user ? user.refreshToken : '',
          {
            onCredentialsUpdated: (credentials: any) => {
              const newUser = new AppUser(
                credentials.username,
                credentials.email,
                credentials.token,
                credentials.roles,
                credentials.refreshToken,
                credentials.enabled,
              );

              dispatch(setUser(newUser));
              newUser.save().then(() => console.log('Credentials saved!'));
            },
            onTokenRefreshed: (token: string, refreshToken: string) => {
              const { username, email, roles, enabled } =
                selectUser(getState());

              const newUser = new AppUser(
                username,
                email,
                token,
                roles,
                refreshToken,
                enabled,
              );

              dispatch(setUser(newUser));
              newUser.save().then(() => console.log('Credentials saved!'));
            },
            onMaintenance: (message: string) => {
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
          },
        );
      } else {
        httpClientService.clear();
      }
    }

    return result;
  };
};
