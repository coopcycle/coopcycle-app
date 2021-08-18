import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import i18n from '../../i18n'
import { defaultNavigationOptions } from '..'
import HeaderButton from '../../components/HeaderButton'

import ConfigureServer from '../ConfigureServer'
import ChooseCity from '../home/ChooseCity'
import CustomServer from '../home/CustomServer'

const MainNavigator = createCompatNavigatorFactory(createStackNavigator)({
  Home: {
    screen: ConfigureServer,
    navigationOptions: ({ navigation }) => ({
      title: 'CoopCycle',
      headerBackTitle: null,
    }),
  },
  HomeChooseCity: {
    screen: ChooseCity,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHOOSE_CITY'),
      headerBackTitle: null,
      headerRight: () => <HeaderButton
        testID="moreServerOptions"
        iconType="FontAwesome5"
        iconName="ellipsis-h"
        iconStyle={{ fontSize: 18 }}
        onPress={ _ => navigation.navigate('HomeCustomServer') } />
      ,
    }),
  },
}, {
  initialRouteKey: 'Home',
  initialRouteName: 'Home',
  defaultNavigationOptions,
})

export default createCompatNavigatorFactory(createStackNavigator)({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
      headerBackTitle: null,
    }),
  },
  HomeCustomServer: {
    screen: CustomServer,
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null,
      title: i18n.t('CUSTOM'),
    }),
  },
}, {
  mode: 'modal',
  defaultNavigationOptions,
})
