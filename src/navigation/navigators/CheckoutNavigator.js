import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
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
  CheckoutRestaurant: {
    screen: navigation.CheckoutRestaurant,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT'),
    })
  },
  CheckoutSummary: {
    screen: navigation.CheckoutSummary,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CART'),
      headerRight: (
        <TouchableOpacity style={{ paddingHorizontal: 10 }}
          onPress={ () => navigation.setParams({ edit: !navigation.getParam('edit', false) }) }>
          <Text style={{ color: 'white' }}>
            { navigation.getParam('edit', false) ? i18n.t('SUBMIT') : i18n.t('EDIT') }
          </Text>
        </TouchableOpacity>
      )
    })
  },
  CheckoutCreditCard: {
    screen: navigation.CheckoutCreditCard,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    })
  },
}, {
  initialRouteKey: 'CheckoutHome',
  initialRouteName: 'CheckoutHome',
  defaultNavigationOptions
})

const LoginRegisterStack = createStackNavigator({
  CheckoutLoginRegister: {
    screen: navigation.CheckoutLogin,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    })
  },
  CheckoutCheckEmail: {
    screen: navigation.AccountCheckEmail,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    })
  }
}, {
  initialRouteName: 'CheckoutLoginRegister',
  defaultNavigationOptions
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
  CheckoutShippingDate: {
    screen: navigation.CheckoutShippingDate,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_SHIPPING_DATE'),
    })
  },
  CheckoutLogin: {
    screen: LoginRegisterStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_LOGIN_TITLE'),
    })
  },
}, {
  mode: 'modal',
  defaultNavigationOptions
})
