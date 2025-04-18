import React, { createRef, useEffect } from 'react';
import "../global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { LogBox, Platform, useColorScheme } from 'react-native';

import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

if (!__DEV__) {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
  });
}

import axios from 'axios';
import { defaultHeaders } from './utils/headers';

for (const [key, value] of Object.entries(defaultHeaders())) {
  axios.defaults.headers.common[key] = value;
}

import { NativeBaseProvider } from 'native-base';
import tracker from './analytics/Tracker';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import KeyboardManager from 'react-native-keyboard-manager';

// import i18n first
import i18n from './i18n';

import Root from './navigation/Loading';
import { linkingPrefixes } from './navigation/constants';

import NotificationHandler from './components/NotificationHandler';
import Spinner from './components/Spinner';
import { setCurrentRoute } from './redux/App/actions';
import store, { persistor } from './redux/store';

import DropdownAlert from 'react-native-dropdownalert';
import DropdownHolder from './DropdownHolder';

import { QueryClient, QueryClientProvider } from 'react-query';
import NavigationHolder from './NavigationHolder';
import FullScreenLoadingIndicator from './navigation/FullScreenLoadingIndicator';
import RootView from './navigation/RootView';
import {
  AccountRegisterConfirmScreen,
  AccountResetPasswordNewPasswordScreen,
} from './navigation/navigators/AccountNavigator';
import { nativeBaseTheme } from './styles/theme';
import {
  DatadogLogger,
  DatadogWrapper,
  navigationContainerOnReady,
} from './Datadog';

if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(false);
  KeyboardManager.setEnableAutoToolbar(false);
  KeyboardManager.setToolbarPreviousNextButtonEnable(false);
}

if (Config.APP_ENV === 'test') {
  LogBox.ignoreAllLogs(true);
}

LogBox.ignoreLogs([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Module RCTImageLoader requires main queue setup',
  'Module RCTBackgroundGeolocation requires main queue setup',
  // @see https://github.com/invertase/react-native-firebase/issues/1446
  'Require cycle:',
  // react-native-camera
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillReceiveProps has been renamed',
  'Warning: componentWillUpdate has been renamed',
  'Accessing view manager configs directly off UIManager',
  'VirtualizedLists should never be nested',
  'When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.',
  // https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting/#reduced-motion-setting-is-enabled-on-this-device
  '[Reanimated] Reduced motion setting is enabled on this device.',
]);

const navigationRef = createRef();
const routeNameRef = createRef();

function getCurrentRoute() {
  return navigationRef.current.getCurrentRoute();
}

function onReady() {
  routeNameRef.current = getCurrentRoute()?.name;
  navigationContainerOnReady(navigationRef);
}

/**
 * @see https://reactnavigation.org/docs/screen-tracking
 */
function onNavigationStateChange(prevState, currentState) {
  const previousRouteName = routeNameRef.current;
  const currentRoute = getCurrentRoute();
  const currentRouteKey = currentRoute?.key;
  const currentRouteName = currentRoute?.name;

  if (previousRouteName !== currentRouteName) {
    store.dispatch(setCurrentRoute(currentRouteName));
    DatadogLogger.info(
      `Starting View “${currentRouteName}” #${currentRouteKey}`,
    );
  }

  routeNameRef.current = currentRouteName;
}

NavigationHolder.setNavigationRef(navigationRef);

// https://reactnavigation.org/docs/5.x/configuring-links/

const config = {
  screens: {
    AccountNav: {
      screens: {
        [AccountRegisterConfirmScreen]: 'register/confirm/:token',
        [AccountResetPasswordNewPasswordScreen]: 'resetting/reset/:token',
        // todo: this path seems broken, I don't see `AccountOrders` in the `AccountNav` navigator
        AccountOrders: {
          screens: {
            AccountOrder: 'order/confirm/:hashid',
          },
        },
      },
    },
    CheckoutNav: {
      screens: {
        CheckoutPaygreenReturn: 'paygreen/return',
        CheckoutPaygreenCancel: 'paygreen/cancel',
      },
    },
  },
};

const linking = {
  prefixes: linkingPrefixes,
  config,
};

export default function App() {
  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

  useEffect(() => {
    // https://support.count.ly/hc/en-us/articles/360037813231-React-Native-Bridge-#implementation
    // We will need to call two methods (init and start) in order to set up our SDK.
    // You may also like to specify other parameters at this step (i.e. whether logging will be used).
    // These methods should only be called once during the app's lifecycle and should be done as early as possible.
    // Your main App component's componentDidMountmethod may be a good place.
    tracker.init();
  }, []);

  return (
    <DatadogWrapper>
      <NativeBaseProvider theme={nativeBaseTheme}>
        <GluestackUIProvider mode="light">
          <RootView>
            <Provider store={store}>
              <PersistGate
                loading={
                  <FullScreenLoadingIndicator debugHint="Initialising the Redux state ..." />
                }
                persistor={persistor}>
                <I18nextProvider i18n={i18n}>
                  <QueryClientProvider client={queryClient}>
                    <SafeAreaProvider>
                      <Spinner />
                      <NavigationContainer
                        ref={navigationRef}
                        linking={linking}
                        onReady={onReady}
                        onStateChange={onNavigationStateChange}
                        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                        <Root />
                      </NavigationContainer>
                      <DropdownAlert
                        ref={ref => {
                          DropdownHolder.setDropdown(ref);
                        }}
                      />
                      <NotificationHandler />
                    </SafeAreaProvider>
                  </QueryClientProvider>
                </I18nextProvider>
              </PersistGate>
            </Provider>
          </RootView>
        </GluestackUIProvider>
      </NativeBaseProvider>
    </DatadogWrapper>
  );
};
