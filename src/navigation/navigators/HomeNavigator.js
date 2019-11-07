import React, { Component } from 'react'
import { View } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions } from '..'
import HeaderButton from '../../components/HeaderButton'

import ConfigureServer from '../ConfigureServer'
import ChooseCity from '../home/ChooseCity'
import CustomServer from '../home/CustomServer'

const MainNavigator = createStackNavigator({
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
      headerRight: (<HeaderButton
        testID="moreServerOptions"
        iconType="FontAwesome5"
        iconName="ellipsis-h"
        iconStyle={{ fontSize: 18 }}
        onPress={ _ => navigation.navigate('HomeCustomServer') } />
      ),
    }),
  },
}, {
  initialRouteKey: 'Home',
  initialRouteName: 'Home',
  defaultNavigationOptions,
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
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
