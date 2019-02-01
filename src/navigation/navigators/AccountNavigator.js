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
  AccountOrder: {
    screen: navigation.AccountOrderPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_NUMBER', { number: navigation.state.params.order.number }),
    })
  },
  AccountDetails: {
    screen: navigation.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    })
  },
  AccountCheckEmail: {
    screen: navigation.AccountCheckEmail,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CHECK_EMAIL'),
    })
  },
  AccountRegisterConfirm: {
    screen: navigation.AccountRegisterConfirm,
    path: 'register/confirm/:token',
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CONFIRM'),
    })
  },
}, {
  initialRouteKey: 'AccountHome',
  initialRouteName: 'AccountHome',
  defaultNavigationOptions
})
