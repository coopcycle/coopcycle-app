import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'

import { stackNavigatorScreenOptions } from '../styles'
import HeaderButton from '../../components/HeaderButton'

import ConfigureServer from '../ConfigureServer'
import ChooseCity from '../home/ChooseCity'
import CustomServer from '../home/CustomServer'

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()

const MainStackScreen = withTranslation()(({ t }) => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="Home"
      component={ ConfigureServer }
      options={{ title: 'CoopCycle' }} />
    <MainStack.Screen
      name="HomeChooseCity"
      component={ ChooseCity }
      options={ ({ navigation, route }) => ({
        title: t('CHOOSE_CITY'),
        headerRight: () => (
          <HeaderButton
            testID="moreServerOptions"
            iconType="FontAwesome5"
            iconName="ellipsis-h"
            iconStyle={{ fontSize: 18 }}
            onPress={ () => navigation.navigate('HomeCustomServer') } />
        )
      })} />
  </MainStack.Navigator>
))

export default withTranslation()(({ t }) => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    mode="modal">
    <RootStack.Screen
      name="Main"
      component={ MainStackScreen }
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="HomeCustomServer"
      component={ CustomServer }
      options={{ title: t('CUSTOM') }} />
  </RootStack.Navigator>
))
