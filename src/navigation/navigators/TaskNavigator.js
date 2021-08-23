import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import screens from '..'
import { stackNavigatorScreenOptions } from '../styles'
import i18n from '../../i18n'

import ProofOfDeliveryTabs from './TaskAttachmentsNavigator'

const CompleteStack = createStackNavigator()

const CompleteNavigator = () => (
  <CompleteStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <CompleteStack.Screen
      name="TaskCompleteHome"
      component={ screens.TaskComplete }
      options={ ({ route }) => ({
        title: `${i18n.t('TASK')} #${route.params?.task.id}`,
      })}
    />
    <CompleteStack.Screen
      name="TaskCompleteProofOfDelivery"
      component={ ProofOfDeliveryTabs }
      options={ ({ route }) => ({
        title: `${i18n.t('TASK')} #${route.params?.task.id}`,
      })}
    />
  </CompleteStack.Navigator>
)

const RootStack = createStackNavigator()

export default () => (
  <RootStack.Navigator
    mode="modal"
    screenOptions={ stackNavigatorScreenOptions }>
    <RootStack.Screen
      name="TaskHome"
      component={ screens.TaskHome }
      options={ ({ route }) => ({
        title: `${i18n.t('TASK')} #${route.params?.task.id}`,
      })}
    />
    <RootStack.Screen
      name="TaskComplete"
      component={ CompleteNavigator }
      options={{
        headerShown: false,
      }}
    />
  </RootStack.Navigator>
)
