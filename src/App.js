import React, { Component } from 'react'
import { Platform, View, YellowBox } from 'react-native'

import { StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'
import coopcycleTheme from '../native-base-theme/variables/coopcycle'
import tracker from './analytics/Tracker'

import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/integration/react'

import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import axios from 'axios'
import VersionNumber from 'react-native-version-number'

import KeyboardManager from 'react-native-keyboard-manager'

if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(false)
    KeyboardManager.setEnableAutoToolbar(false)
    KeyboardManager.setToolbarPreviousNextButtonEnable(false)
}

axios.defaults.headers.common['X-CoopCycle-App-Version'] = VersionNumber.appVersion

// Import i18n first
import i18n from './i18n'

import { URI_PREFIX } from './navigation/constants'
import store, { persistor } from './redux/store'
import { setCurrentRoute } from './redux/App/actions'
// import NotificationHandler from './components/NotificationHandler'
import Spinner from './components/Spinner'

import DropdownAlert from 'react-native-dropdownalert'
import DropdownHolder from './DropdownHolder'

import Root from './navigation/Root'

import { navigationRef } from './NavigationHolder'

YellowBox.ignoreWarnings([
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
  'No native splash screen registered',
])

/**
 * @see https://reactnavigation.org/docs/en/screen-tracking.html
 */
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

function onNavigationStateChange(prevState, currentState) {
  const currentScreen = getActiveRouteName(currentState)
  const prevScreen = getActiveRouteName(prevState)
  if (prevScreen !== currentScreen) {
    store.dispatch(setCurrentRoute(currentScreen))
  }
}

// @see https://reactnavigation.org/docs/configuring-links/
const linking = {
  prefixes: [
    'https://*.coopcycle.org',
    'https://coopcycle.org',
    'coopcycle://',
    'https://livraison.sicklo.fr',
    'https://khora.berlin',
  ],
  /* configuration for matching screens with paths */
  config: {
    screens: {
      RegisterConfirm: 'register/confirm/:token',
      AccountResetPasswordNewPassword: 'resetting/reset/:token',
    },
  },
}

class App extends Component {

  componentDidMount() {
    // https://support.count.ly/hc/en-us/articles/360037813231-React-Native-Bridge-#implementation
    // We will need to call two methods (init and start) in order to set up our SDK.
    // You may also like to specify other parameters at this step (i.e. whether logging will be used).
    // These methods should only be called once during the app's lifecycle and should be done as early as possible.
    // Your main App component's componentDidMountmethod may be a good place.
    tracker.init()
  }

  render() {

    return (
      <Provider store={ store }>
        <PersistGate loading={ null } persistor={ persistor }>
          <I18nextProvider i18n={ i18n }>
            <StyleProvider style={ getTheme(coopcycleTheme) }>
              <View style={{ flex: 1 }}>
                <Spinner />
                <SafeAreaProvider>
                  <NavigationContainer ref={ navigationRef } linking={ linking }>
                    <Root />
                  </NavigationContainer>
                  {
                  /*
                  <RootNavigator
                    uriPrefix={ URI_PREFIX }
                    ref={ ref => { NavigationHolder.setTopLevelNavigator(ref) } }
                    onNavigationStateChange={ onNavigationStateChange } />
                  */
                  }
                </SafeAreaProvider>
                <DropdownAlert ref={ ref => { DropdownHolder.setDropdown(ref) } } />
                { /* <NotificationHandler /> */ }
              </View>
            </StyleProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
