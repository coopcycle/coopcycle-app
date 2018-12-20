import React, { Component } from 'react'
import { createDrawerNavigator } from 'react-navigation'
import { Icon } from 'native-base'

import DrawerContent from '../components/DrawerContent'

import AccountNavigator from './AccountNavigator'
import CheckoutNavigator from './CheckoutNavigator'
import CourierNavigator from './CourierNavigator'
import DispatchNavigator from './DispatchNavigator'
import RestaurantNavigator from './RestaurantNavigator'

import i18n from '../../i18n'

export default createDrawerNavigator({
  CheckoutNav: {
    screen: CheckoutNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: 'Rechercher…',
    })
  },
  AccountNav: {
    screen: AccountNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('MY_ACCOUNT'),
    })
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
    })
  },
  CourierNav: {
    screen: CourierNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('TASKS'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    })
  },
  DispatchNav: {
    screen: DispatchNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('DISPATCH'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    })
  },
}, {
  contentComponent: DrawerContent,
})
