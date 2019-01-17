import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation'

import navigation, { defaultNavigationOptions, headerLeft } from '..'
import i18n from '../../i18n'

export default createStackNavigator({
  AccountHome: {
    screen: navigation.AccountPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions
    })
  },
  AccountAddresses: {
    screen: navigation.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ADDRESSES'),
    })
  },
  AccountOrders: {
    screen: navigation.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ORDERS'),
    })
  },
  AccountOrderTracking: {
    screen: navigation.OrderTrackingPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_TRACKING'),
    })
  },
  AccountDetails: {
    screen: navigation.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    })
  },
}, {
  initialRouteKey: 'AccountHome',
  initialRouteName: 'AccountHome',
  defaultNavigationOptions
})
