import NetInfo from '@react-native-community/netinfo';

import { setInternetReachable } from '../../App/actions';

let initialized = false;

export default ({ getState, dispatch }) => {
  return next => action => {
    if (!initialized) {
      NetInfo.addEventListener(state => {
        dispatch(setInternetReachable(state.isInternetReachable));
      });
      initialized = true;
    }

    return next(action);
  };
};
