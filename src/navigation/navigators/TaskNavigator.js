import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'

import { stackNavigatorScreenOptions } from '../styles'
import screens from '..'

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator'

const CompleteStack = createStackNavigator()

const CompleteStackNavigator = () => (
  <CompleteStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <CompleteStack.Screen
      name="TaskCompleteHome"
      component={ screens.TaskComplete }
      options={{ headerShown: false }}
    />
    <CompleteStack.Screen
      name="TaskCompleteProofOfDelivery"
      component={ ProofOfDeliveryTabs }
      options={{ headerShown: false }}
    />
  </CompleteStack.Navigator>
)

/*
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
*/

/*
export default createStackNavigator({
  TaskHome: {
    screen: screens.TaskHome,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
  TaskComplete: {
    screen: CompleteStack,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'TaskHome',
  navigationOptions: ({ navigation }) => ({
    // We need to override the back button behavior
    // because otherwise when we hit "back" on the PoD screen,
    // it goes back to the task screen
    headerLeft: (props) => {

      const routeName = getActiveRouteName(navigation.state)

      let { onPress, title, backImage, ...otherProps } = props

      if (routeName === 'TaskCompleteHome') {
        title = i18n.t('CANCEL')
      }
      if (routeName === 'TaskPhoto' || routeName === 'TaskSignature' || routeName === 'TaskHome') {
        title = 'Back'
      }

      return (
        <HeaderBackButton { ...otherProps }
          onPress={ () => navigation.goBack(null) }
          title={ title }
          backImage={ backImage } />
      )
    },
  }),
})
*/

const RootStack = createStackNavigator()

export default withTranslation()(({ t }) => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    mode="modal">
    <RootStack.Screen
      name="TaskHome"
      component={ screens.TaskHome }
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="TaskComplete"
      component={ CompleteStackNavigator }
      options={{ headerShown: false }}
    />
  </RootStack.Navigator>
))
