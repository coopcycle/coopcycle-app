import React, { Component } from 'react'
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import { Icon } from 'native-base'

import DrawerContent from '../components/DrawerContent'

import AccountNavigator from './AccountNavigator'
import CheckoutNavigator from './CheckoutNavigator'
import CourierNavigator from './CourierNavigator'
import DispatchNavigator from './DispatchNavigator'
import RestaurantNavigator from './RestaurantNavigator'
import navigation, { defaultNavigationOptions, headerLeft } from '..'

import i18n from '../../i18n'

const RegisterConfirmStack = createStackNavigator({
  RegisterConfirmHome: {
    screen: navigation.AccountRegisterConfirm,
    path: 'confirm/:token',
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CONFIRM'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
}, {
  initialRouteName: 'RegisterConfirmHome',
  defaultNavigationOptions,
})

export default createDrawerNavigator({
  CheckoutNav: {
    screen: CheckoutNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Rechercher…',
    }),
  },
  AccountNav: {
    screen: AccountNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('MY_ACCOUNT'),
    }),
  },
  RestaurantNav: {
    screen: RestaurantNavigator,
    navigationOptions: ({ navigation }) => ({
      // This route is "dynamic", it may appear several times
      // @see src/navigation/components/DrawerContent.js
      drawerLabel: '',
      drawerIcon: ({ tintColor }) => (
        <Icon name="restaurant" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  CourierNav: {
    screen: CourierNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('TASKS'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  DispatchNav: {
    screen: DispatchNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('DISPATCH'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  // This screen will not appear in drawer
  // We need to put it here to be acessible from everywhere
  RegisterConfirmNav: {
    screen: RegisterConfirmStack,
    path: '/register',
  },
}, {
  contentComponent: DrawerContent,
})
