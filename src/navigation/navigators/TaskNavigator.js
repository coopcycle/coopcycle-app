import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import screens, { defaultNavigationOptions } from '..'

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
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'TaskHome',
})
