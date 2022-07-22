import React, { createRef, useEffect } from 'react'
import { LogBox, Platform, useColorScheme, SafeAreaView } from 'react-native'

import { NativeBaseProvider, extendTheme } from 'native-base'
import tracker from './analytics/Tracker'

import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/integration/react'

import axios from 'axios'
import VersionNumber from 'react-native-version-number'

import KeyboardManager from 'react-native-keyboard-manager'

import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: Config.SENTRY_DSN,
})

if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(false)
    KeyboardManager.setEnableAutoToolbar(false)
    KeyboardManager.setToolbarPreviousNextButtonEnable(false)
}

axios.defaults.headers.common['X-CoopCycle-App-Version'] = VersionNumber.appVersion

// Import i18n first
import i18n from './i18n'

import Root from './navigation/Loading'
import { linkingPrefixes } from './navigation/constants'

import store, { persistor } from './redux/store'
import { setCurrentRoute } from './redux/App/actions'
import NotificationHandler from './components/NotificationHandler'
import Spinner from './components/Spinner'

import DropdownAlert from 'react-native-dropdownalert'
import DropdownHolder from './DropdownHolder'

import NavigationHolder from './NavigationHolder'
import { QueryClient, QueryClientProvider } from 'react-query';

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
])

const navigationRef = createRef()
const routeNameRef = createRef()

/**
 * @see https://reactnavigation.org/docs/screen-tracking
 */
function onNavigationStateChange(prevState, currentState) {
  const previousRouteName = routeNameRef.current;
  const currentRouteName = navigationRef.current.getCurrentRoute().name

  if (previousRouteName !== currentRouteName) {
    store.dispatch(setCurrentRoute(currentRouteName))
  }

  routeNameRef.current = currentRouteName;
}

NavigationHolder.setNavigationRef(navigationRef)

// https://reactnavigation.org/docs/5.x/configuring-links/

const config = {
  screens: {
    RegisterConfirmNav: 'register/confirm/:token',
    ResetPasswordNav: 'resetting/reset/:token',
    AccountNav: {
      screens: {
        AccountOrders: {
          screens: {
            AccountOrder: 'order/confirm/:hashid',
          },
        },
      },
    },
  },
}

const linking = {
  prefixes: linkingPrefixes,
  config,
}

const App = () => {

  const colorScheme = useColorScheme()

  const customTheme = extendTheme({
    config: {
      useSystemColorMode: true,
    },
  })

  const queryClient = new QueryClient()

  useEffect(() => {
    // https://support.count.ly/hc/en-us/articles/360037813231-React-Native-Bridge-#implementation
    // We will need to call two methods (init and start) in order to set up our SDK.
    // You may also like to specify other parameters at this step (i.e. whether logging will be used).
    // These methods should only be called once during the app's lifecycle and should be done as early as possible.
    // Your main App component's componentDidMountmethod may be a good place.
    tracker.init()
  }, [])

  return (
    <Provider store={ store }>
      <PersistGate loading={ null } persistor={ persistor }>
        <I18nextProvider i18n={ i18n }>
          <QueryClientProvider client={queryClient}>
            <NativeBaseProvider theme={customTheme}>
              <SafeAreaProvider>
                <Spinner />
                <NavigationContainer
                  ref={ navigationRef }
                  linking={ linking }
                  onReady={ () => (routeNameRef.current = navigationRef.current.getCurrentRoute()?.name) }
                  onStateChange={ onNavigationStateChange }
                  theme={ colorScheme === 'dark' ? DarkTheme : DefaultTheme }>
                  <Root />
                </NavigationContainer>
                <DropdownAlert ref={ ref => { DropdownHolder.setDropdown(ref) } } />
                <NotificationHandler />
              </SafeAreaProvider>
            </NativeBaseProvider>
          </QueryClientProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
