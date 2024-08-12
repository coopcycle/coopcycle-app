import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

let initialized = false;

let appStateSubscription = null;
let appState = AppState.currentState;

let netInfoUnsubscribe = null;

export function setupListenersReactNative(
  dispatch,
  { onFocus, onFocusLost, onOffline, onOnline },
) {
  const handleFocus = () => dispatch(onFocus());
  const handleFocusLost = () => dispatch(onFocusLost());
  const handleOnline = () => dispatch(onOnline());
  const handleOffline = () => dispatch(onOffline());

  const _handleAppStateChange = nextAppState => {
    const foreground = !!(
      appState.match(/inactive|background/) && nextAppState === 'active'
    );

    if (foreground) handleFocus();
    else handleFocusLost();

    appState = nextAppState;
  };

  const _handleNetInfoChange = state => {
    const { isInternetReachable } = state;

    if (isInternetReachable) handleOnline();
    else handleOffline();
  };

  if (!initialized) {
    appStateSubscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    netInfoUnsubscribe = NetInfo.addEventListener(_handleNetInfoChange);
    initialized = true;
  }

  const unsubscribe = () => {
    if (appStateSubscription) {
      appStateSubscription.remove();
      appStateSubscription = null;
    }
    if (netInfoUnsubscribe) {
      netInfoUnsubscribe();
      netInfoUnsubscribe = null;
    }
    initialized = false;
  };

  return unsubscribe;
}
