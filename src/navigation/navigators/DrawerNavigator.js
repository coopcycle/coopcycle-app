import React from 'react'
import { createDrawerNavigator } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack'
import { Icon } from 'native-base'

import DrawerContent from '../components/DrawerContent'

import AccountNavigator from './AccountNavigator'
import CheckoutNavigator from './CheckoutNavigator'
import CourierNavigator from './CourierNavigator'
import DispatchNavigator from './DispatchNavigator'
import RestaurantNavigator from './RestaurantNavigator'
import StoreNavigator from './StoreNavigator'

import screens, { defaultNavigationOptions, headerLeft } from '..'

import i18n from '../../i18n'

const RegisterConfirmStack = createStackNavigator({
  RegisterConfirmHome: {
    screen: screens.AccountRegisterConfirm,
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

const ResetPasswordStack = createStackNavigator({
  ResetPasswordHome: {
    screen: screens.AccountResetPasswordNewPassword,
    path: 'reset/:token',
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESET_PASSWORD_NEW_PASSWORD'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
}, {
  initialRouteName: 'ResetPasswordHome',
  defaultNavigationOptions,
})

export default createDrawerNavigator({
  CheckoutNav: {
    screen: CheckoutNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('SEARCH'),
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
  StoreNav: {
    screen: StoreNavigator,
    navigationOptions: ({ navigation }) => ({
      // This route is "dynamic", it may appear several times
      // @see src/navigation/components/DrawerContent.js
      drawerLabel: '',
      drawerIcon: ({ tintColor }) => (
        <Icon name="shopping-cart" type="FontAwesome" style={{ fontSize: 16, color: tintColor }} />
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
  // This screen will not appear in drawer, but handle an activate account deep link
  // We need to put it here to be accessible from everywhere
  RegisterConfirmNav: {
    screen: RegisterConfirmStack,
    path: '/register',
  },
  // This screen will not appear in drawer, but handle a reset password deep link
  // We need to put it here to be accessible from everywhere
  ResetPasswordNav: {
    screen: ResetPasswordStack,
    path: '/resetting',
  },
}, {
  contentComponent: DrawerContent,
})
