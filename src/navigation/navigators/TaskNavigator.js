import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import screens, { defaultNavigationOptions } from '..'
import i18n from '../../i18n'

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator'

const CompleteStack = createCompatNavigatorFactory(createStackNavigator)({
  TaskCompleteHome: {
    screen: screens.TaskComplete,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.params.task.id}`,
    }),
  },
  TaskCompleteProofOfDelivery: {
    screen: ProofOfDeliveryTabs,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.params.task.id}`,
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
      title: `${i18n.t('TASK')} #${navigation.state.params.params.task.id}`,
    }),
  },
  TaskComplete: {
    screen: CompleteStack,
    navigationOptions: ({ navigation }) => ({
      // Use headerShown = false to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'TaskHome',
})
