import React, { Component } from 'react'
import {
  Alert,
  Platform,
  View,
  ActivityIndicator
} from 'react-native'

import { Root, StyleProvider } from 'native-base'
import getTheme from '../native-base-theme/components'
import material from '../native-base-theme/variables/material'

import moment from 'moment'
import { NavigationActions, createSwitchNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { translate, I18nextProvider } from 'react-i18next'

import Sound from 'react-native-sound'
// Make sure sound will play even when device is in silent mode
Sound.setCategory('Playback')

import navigation from './navigation'
import navigators from './navigation/navigators'
import i18n from './i18n'
import store from './redux/store'
import { loadTasks } from './redux/Courier'
import { loadOrders } from './redux/Restaurant/actions'
import { setRemotePushToken, setCurrentRoute } from './redux/App/actions'
import PushNotification from './notifications'

import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Module RCTImageLoader requires main queue setup',
  'Module RCTBackgroundGeolocation requires main queue setup'
])

const RootNavigator = createSwitchNavigator(
  {
    Loading: navigation.Loading,
    AppStack: navigators.AppStack,
    ConfigureServer: navigation.ConfigureServer
  },
  {
    initialRouteName: 'Loading',
  }
)

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

class App extends Component {

  componentDidMount() {

    const onTasksChanged = date => {

      const { app } = store.getState()
      const { httpClient, currentRoute } = app

      if (currentRoute !== 'CourierTaskList') {
        const pushAction = NavigationActions.navigate({
          routeName: 'CourierTaskList',
          params: {}
        })
        this.navigator.dispatch(pushAction)
      }

      store.dispatch(loadTasks(httpClient, moment(date)))
    }

    const onOrderCreated = (restaurant, date) => {

      const { app } = store.getState()
      const { httpClient, currentRoute } = app

      if (currentRoute !== 'RestaurantDashboard') {
        const pushAction = NavigationActions.navigate({
          routeName: 'RestaurantDashboard',
          params: {
            restaurant
          }
        })
        this.navigator.dispatch(pushAction)
      } else {
        store.dispatch(loadOrders(httpClient, restaurant, moment(date).format('YYYY-MM-DD')))
      }

    }

    PushNotification.configure({
      onRegister: token => store.dispatch(setRemotePushToken(token)),
      onNotification: notification => {
        const { event } = notification.data

        if (event && event.name === 'order:created') {
          const { restaurant, date } = event.data
          if (notification.foreground) {

            // Load and play sound until the alert is closed
            const bell = new Sound('misstickle__indian_bell_chime.wav', Sound.MAIN_BUNDLE, (error) => {
              if (error) {
                return
              }
              bell.setNumberOfLoops(-1)
              bell.play((success) => {
                if (!success) {
                  bell.reset();
                }
              })
            })

            Alert.alert(
              'Nouvelle commande',
              `Une nouvelle commande pour le ${event.data.date} a été créée`,
              [
                {
                  text: 'Annuler',
                  onPress: () => {
                    bell.stop(() => {})
                  }
                },
                {
                  text: 'Afficher',
                  onPress: () => {
                    bell.stop(() => {})
                    onOrderCreated(restaurant, date)
                  }
                },
              ],
              {
                cancelable: true
              }
            )
          } else {
            onOrderCreated(restaurant, date)
          }
        }

        if (event && event.name === 'tasks:changed') {
          if (notification.foreground) {
            Alert.alert(
              'Tâches mises à jour',
              `Vos tâches du ${event.data.date} ont été mises à jour`,
              [
                {
                  text: 'Annuler',
                  onPress: () => {}
                },
                {
                  text: 'Afficher',
                  onPress: () => onTasksChanged(event.data.date)
                },
              ],
              {
                cancelable: true
              }
            )
          } else {
            onTasksChanged(event.data.date)
          }
        }
      }
    })
  }

  componentWillUnmount() {
    PushNotification.removeListeners()
  }

  render() {
    return (
      <Root>
        <Provider store={ store }>
          <I18nextProvider i18n={ i18n }>
            <StyleProvider style={ getTheme(material) }>
              <RootNavigator
                ref={ ref => { this.navigator = ref } }
                onNavigationStateChange={ onNavigationStateChange } />
            </StyleProvider>
          </I18nextProvider>
        </Provider>
      </Root>
    )
  }

}

export default App
