import React, { Component } from 'react'
import { Icon } from 'native-base'
import {
  createStackNavigator,
  HeaderBackButton } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'

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

export default createStackNavigator({
  RestaurantSettingsHome: {
    screen: navigation.RestaurantSettings,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
  RestaurantProducts: {
    screen: navigation.RestaurantProducts,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_PRODUCTS'),
    }),
  },
  RestaurantOpeningHours: {
    screen: navigation.RestaurantOpeningHours,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_OPENING_HOURS'),
    }),
  },
  RestaurantMenus: {
    screen: navigation.RestaurantMenus,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_MENUS'),
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'RestaurantSettingsHome',
  navigationOptions: ({ navigation }) => ({
    // We need to override the back button behavior
    // because otherwise when we hit "back" on the PoD screen,
    // it goes back to the task screen
    headerLeft: (props) => {

      const routeName = getActiveRouteName(navigation.state)

      let { onPress, title, backImage, ...otherProps } = props

      return (
        <HeaderBackButton { ...otherProps }
          onPress={ () => navigation.goBack(null) }
          title={ 'Back' }
          backImage={ backImage } />
      )
    },
  }),
})
