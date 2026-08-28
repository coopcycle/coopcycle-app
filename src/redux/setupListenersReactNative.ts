import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';

let initialized = false;

let appStateSubscription = null;

// Whether the app has actually left the screen since the last focus event.
// See `_handleAppStateChange`.
let hasBeenBackgrounded = false;

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
    // A focus event refetches every query subscribed with `refetchOnFocus` —
    // for a courier that means the whole task list. iOS reports 'inactive' for
    // transient interruptions the user never actually left the app for (the
    // camera, permission dialogs, alerts, control centre, a notification
    // banner), and several of those happen during a single task completion, so
    // only a real round trip through 'background' counts as a focus event.
    if (nextAppState === 'background') {
      hasBeenBackgrounded = true;
      handleFocusLost();
      return;
    }

    if (nextAppState === 'active' && hasBeenBackgrounded) {
      hasBeenBackgrounded = false;
      handleFocus();
    }
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
