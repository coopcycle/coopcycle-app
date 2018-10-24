import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon, Text } from 'native-base'
import { createStackNavigator } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'

const MainNavigator = createStackNavigator({
  CheckoutHome: {
    screen: navigation.RestaurantsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANTS'),
      headerLeft: headerLeft(navigation)
    })
  },
  Restaurant: {
    screen: navigation.RestaurantPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT'),
    })
  },
  RestaurantOrder: {
    screen: navigation.RestaurantOrder,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT_ORDER_TITLE', { order: navigation.state.params.order }),
    })
  },
  Cart: {
    screen: navigation.CartPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CART'),
    })
  },
  CartAddress: {
    screen: navigation.CartAddressPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DELIVERY_ADDR'),
    })
  },
  CreditCard: {
    screen: navigation.CreditCardPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    })
  },
  OrderTracking: {
    screen: navigation.OrderTrackingPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_TRACKING'),
    })
  },
}, {
  initialRouteKey: 'CheckoutHome',
  initialRouteName: 'CheckoutHome',
  navigationOptions: {
    ...defaultNavigationOptions
  }
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    })
  },
  CheckoutProductOptions: {
    screen: navigation.CheckoutProductOptions,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_PRODUCT_OPTIONS_TITLE'),
    })
  },
  CheckoutEditItem: {
    screen: navigation.CheckoutEditItem,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHANGE_QUANT'),
    })
  },
  CheckoutLogin: {
    screen: navigation.CheckoutLogin,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_LOGIN_TITLE'),
    })
  },
}, {
  mode: 'modal',
})
