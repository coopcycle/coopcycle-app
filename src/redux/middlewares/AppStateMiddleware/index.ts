import { AppState } from 'react-native';
import { appStateChanged } from '../../App/actions';

let initialized = false;
let appState = AppState.currentState;

export default ({ getState, dispatch }) => {
  return next => action => {
    if (!initialized) {
      AppState.addEventListener('change', nextAppState => {
        if (appState !== nextAppState) {
          appState = nextAppState;
          dispatch(appStateChanged(nextAppState));
        }
      });
      initialized = true;
    }
    return next(action);
  };
};
