import React, { Component } from 'react'
import { Icon } from 'native-base'
import { View, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import AccountPage from '../AccountPage'
import Home from '../Home'
import RestaurantsPage from '../RestaurantsPage'
import HeaderButton from '../../components/HeaderButton'
import i18n from '../../i18n'
import store from '../../redux/store'

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

  const state = store.getState()
  const { user } = state.app

  let headerRight

  if (user && user.isAuthenticated()) {

    if (user.hasRole('ROLE_COURIER')) {
      headerRight = (
        <HeaderButton iconName="ios-bicycle"
          onPress={ () => navigation.navigate('Courier', { connected: false, tracking: false }) } />
      )
    }

    if (user.hasRole('ROLE_RESTAURANT')) {
      headerRight = (
        <HeaderButton iconName="restaurant"
          onPress={ () => navigation.navigate('RestaurantList') } />
      )
    }

  } else {
    headerRight = (
      <View />
    )
  }

  return {
    title: 'CoopCycle',
    headerRight,
    headerRightContainerStyle: {
      flex: 1
    }
  }

}

export default TabNavigator
