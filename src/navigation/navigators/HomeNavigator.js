import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import i18n from '../../i18n'
import { stackNavigatorScreenOptions } from '../styles'
import HeaderButton from '../../components/HeaderButton'

import ConfigureServer from '../ConfigureServer'
import ChooseCity from '../home/ChooseCity'
import CustomServer from '../home/CustomServer'

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="Home"
      component={ ConfigureServer }
      options={{
        title: 'CoopCycle',
        headerBackTitle: null,
      }}
    />
    <MainStack.Screen
      name="HomeChooseCity"
      component={ ChooseCity }
      options={({ navigation }) => ({
        title: i18n.t('CHOOSE_CITY'),
        headerBackTitle: null,
        headerRight: () => <HeaderButton
          testID="moreServerOptions"
          iconType="FontAwesome5"
          iconName="ellipsis-h"
          iconStyle={{ fontSize: 18 }}
          onPress={ () => navigation.navigate('HomeCustomServer') } />
        ,
      })}
    />
  </MainStack.Navigator>
)

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="Main"
      component={ MainNavigator }
      options={{
        headerShown: false,
        headerBackTitle: null,
      }}
    />
    <RootStack.Screen
      name="HomeCustomServer"
      component={ CustomServer }
      options={{
        headerBackTitle: null,
        title: i18n.t('CUSTOM'),
      }}
    />
  </RootStack.Navigator>
)
