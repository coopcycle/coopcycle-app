import React from 'react'
import {
  createStackNavigator,
  HeaderBackButton,
} from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

import i18n from '../../i18n'
import screens, { defaultNavigationOptions } from '..'
import { stackNavigatorScreenOptions } from '../styles'

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator'

const CompleteStack = createCompatNavigatorFactory(createStackNavigator)({
  TaskCompleteHome: {
    screen: screens.TaskComplete,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
  TaskCompleteProofOfDelivery: {
    screen: ProofOfDeliveryTabs,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'TaskCompleteHome',
})

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

export default createCompatNavigatorFactory(createStackNavigator)({
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

function mapStateToProps(state) {

  return {
    currentRoute: state.app.currentRoute,
  }
}

const RootStack = createStackNavigator()

const TaskNav = withTranslation()(({ currentRoute, t }) => {

  const navigation = useNavigation()

  return (
    <RootStack.Navigator mode="modal"
      screenOptions={{
        ...stackNavigatorScreenOptions,
        // headerLeft: (props) => {

        //   console.log('headerLeft', props)
        //   return 'Fooo'
        // }
      }}>
      <RootStack.Screen
        name="TaskHome"
        component={ screens.TaskHome }
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="TaskComplete"
        component={ CompleteStack }
        options={{
          headerShown: false,
          // headerLeft: (props) => {

          //   let { onPress, title, backImage, ...otherProps } = props

          //   if (currentRoute === 'StoreNewDeliveryAddress') {
          //     title = t('CANCEL')
          //   } else {
          //     title = 'Back'
          //   }

          //   return (
          //     <HeaderBackButton { ...otherProps }
          //       onPress={ () => navigation.navigate('StoreHome') }
          //       title={ title }
          //       backImage={ backImage } />
          //   )
          // }
        }}
        />
    </RootStack.Navigator>
  )
})

export default connect(mapStateToProps)(TaskNav)
