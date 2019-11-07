import React, { Component } from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'

import navigation, { defaultNavigationOptions, headerLeft } from '..'
import i18n from '../../i18n'

const AuthenticatedStack = createStackNavigator({
  AccountHome: {
    screen: navigation.AccountHome,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
  AccountAddresses: {
    screen: navigation.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ADDRESSES'),
    }),
  },
  AccountOrders: {
    screen: navigation.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ORDERS'),
    }),
  },
  AccountOrder: {
    screen: navigation.AccountOrderPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_NUMBER', { number: navigation.state.params.order.number }),
    }),
  },
  AccountDetails: {
    screen: navigation.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    }),
  },
}, {
  initialRouteKey: 'AccountHome',
  initialRouteName: 'AccountHome',
  defaultNavigationOptions,
})

const NotAuthenticatedStack = createStackNavigator({
  AccountLoginRegister: {
    screen: navigation.AccountLoginRegister,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
  AccountCheckEmail: {
    screen: navigation.AccountCheckEmail,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CHECK_EMAIL'),
    }),
  },
}, {
  initialRouteName: 'AccountLoginRegister',
  defaultNavigationOptions,
})

export default createSwitchNavigator({
  AccountNotAuthenticated: NotAuthenticatedStack,
  AccountAuthenticated: AuthenticatedStack,
}, {
  initialRouteName: 'AccountNotAuthenticated',
})
