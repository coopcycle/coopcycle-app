import React, { Component } from 'react'
import { View, YellowBox } from 'react-native'

import { StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'
import coopcycleTheme from '../native-base-theme/variables/coopcycle'

import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { NetworkProvider } from 'react-native-offline'
import { PersistGate } from 'redux-persist/integration/react'

import navigation from './navigation'
import navigators from './navigation/navigators'
import i18n, { localeDetector } from './i18n'

// Make sure to call moment.locale() BEFORE creating Redux store
import moment from 'moment'
moment.locale(localeDetector())

import store, { persistor } from './redux/store'
import { setCurrentRoute } from './redux/App/actions'
import NotificationHandler from './components/NotificationHandler'
import Spinner from './components/Spinner'

import DropdownAlert from 'react-native-dropdownalert'
import DropdownHolder from './DropdownHolder'

import NavigationHolder from './NavigationHolder'

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Module RCTImageLoader requires main queue setup',
  'Module RCTBackgroundGeolocation requires main queue setup',
  // @see https://github.com/invertase/react-native-firebase/issues/1446
  'Require cycle:',
  // react-native-camera
  'permissionDialogTitle and permissionDialogMessage are deprecated',
  'Warning: componentWillMount has been renamed',
  'Warning: componentWillReceiveProps has been renamed',
  'Accessing view manager configs directly off UIManager',
])

const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    Loading: navigation.Loading,
    ConfigureServer: navigators.HomeNavigator,
    App: {
      screen: navigators.DrawerNavigator,
      path: '', // This is needed to start deep linking from here
    },
  },
  {
    initialRouteName: 'Loading',
  }
))

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

const prefix = /https?:\/\/[a-z0-9]+\.coopcycle\.org|coopcycle:\//

class App extends Component {

  render() {

    return (
      <NetworkProvider>
        <Provider store={ store }>
          <PersistGate loading={ null } persistor={ persistor }>
            <I18nextProvider i18n={ i18n }>
              <StyleProvider style={ getTheme(coopcycleTheme) }>
                <View style={{ flex: 1 }}>
                  <Spinner />
                  <RootNavigator
                    uriPrefix={ prefix }
                    ref={ ref => { NavigationHolder.setTopLevelNavigator(ref) } }
                    onNavigationStateChange={ onNavigationStateChange } />
                  <DropdownAlert ref={ ref => { DropdownHolder.setDropdown(ref) } } />
                  <NotificationHandler />
                </View>
              </StyleProvider>
            </I18nextProvider>
          </PersistGate>
        </Provider>
      </NetworkProvider>
    )
  }

}

export default App
