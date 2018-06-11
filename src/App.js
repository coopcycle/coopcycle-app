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
import { NavigationActions, StackNavigator, SwitchNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { translate, I18nextProvider } from 'react-i18next'

import navigation from './navigation'
import navigators from './navigation/navigators'
import i18n from './i18n'
import store from './redux/store'
import { loadTasks } from './redux/Courier'
import { setRemotePushToken } from './redux/App/actions'
import PushNotification from './notifications'

import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Module RCTImageLoader requires main queue setup',
  'Module RCTBackgroundGeolocation requires main queue setup'
])

const RootNavigator = SwitchNavigator(
  {
    Loading: navigation.Loading,
    AppStack: navigators.AppStack,
    ConfigureServer: navigation.ConfigureServer
  },
  {
    initialRouteName: 'Loading',
  }
)

class App extends Component {

  componentDidMount() {

    const onTasksChanged = date => {

      const { app } = store.getState()
      const { httpClient, currentRoute } = app

      if (currentRoute !== 'CourierTaskList') {
        const pushAction = NavigationActions.push({
          routeName: 'CourierTaskList',
          params: {}
        })
        this.navigator.dispatch(pushAction)
      }

      store.dispatch(loadTasks(httpClient, moment(date)))
    }

    PushNotification.configure({
      onRegister: token => store.dispatch(setRemotePushToken(token)),
      onNotification: notification => {
        const { event } = notification.data
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
              <RootNavigator ref={ ref => { this.navigator = ref } } />
            </StyleProvider>
          </I18nextProvider>
        </Provider>
      </Root>
    )
  }

}

export default App
