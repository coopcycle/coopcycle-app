import React, { Component } from 'react'
import { Icon } from 'native-base'
import { View, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import { translate } from 'react-i18next'

import AccountPage from '../AccountPage'
import Home from '../Home'
import RestaurantsPage from '../RestaurantsPage'
import HeaderRightButton from '../../components/HeaderRightButton'
import i18n from '../../i18n'

const tabNavigatorConfig = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: '#e4022d',
    inactiveTintColor: '#4c4c4c',
    showLabel: false,
    showIcon: true,
    style: {
      backgroundColor: '#fff',
    },
    indicatorStyle: {
      backgroundColor: '#e4022d'
    }
  },
}

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('HOME'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" style={{ color: tintColor }} />
      ),
    })
  },
  Restaurants: {
    screen: RestaurantsPage,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('RESTAURANTS'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="restaurant" style={{ color: tintColor }} />
      ),
    })
  },
  Account: {
    screen: AccountPage,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('MY_ACCOUNT'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" style={{ color: tintColor }} />
      ),
    })
  },
}, tabNavigatorConfig)

TabNavigator.navigationOptions = ({ navigation }) => {
  return {
    title: 'CoopCycle',
    headerRight: (
      <HeaderRightButton navigation={ navigation } />
    ),
    headerRightContainerStyle: {
      flex: 1
    }
  }
}

export default TabNavigator
