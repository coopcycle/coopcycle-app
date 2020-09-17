import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Text} from 'native-base'
import { createStackNavigator } from 'react-navigation-stack'

import i18n from '../../i18n'
import screens, {defaultNavigationOptions, headerLeft} from '..'

const MainNavigator = createStackNavigator({
  CheckoutHome: {
    screen: screens.RestaurantsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANTS'),
      headerLeft: headerLeft(navigation),
    }),
  },
  CheckoutRestaurant: {
    screen: screens.CheckoutRestaurant,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT'),
    }),
  },
  CheckoutSummary: {
    screen: screens.CheckoutSummary,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CART'),
      headerRight: () =>
        <TouchableOpacity style={{ paddingHorizontal: 10 }}
          onPress={ () => navigation.setParams({ edit: !navigation.getParam('edit', false) }) }>
          <Text style={{ color: 'white' }}>
            { navigation.getParam('edit', false) ? i18n.t('FINISHED') : i18n.t('EDIT') }
          </Text>
        </TouchableOpacity>
      ,
    }),
  },
  CheckoutCreditCard: {
    screen: screens.CheckoutCreditCard,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    }),
  },
  CheckoutMercadopago: {
    screen: screens.CheckoutMercadopago,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    }),
  },
}, {
  initialRouteKey: 'CheckoutHome',
  initialRouteName: 'CheckoutHome',
  defaultNavigationOptions,
})

const LoginRegisterStack = createStackNavigator({
  CheckoutLoginRegister: {
    screen: screens.CheckoutLogin,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
  CheckoutCheckEmail: {
    screen: screens.AccountRegisterCheckEmail,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
  CheckoutForgotPassword: {
    screen: screens.AccountForgotPassword,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
  CheckoutResetPasswordCheckEmail: {
    screen: screens.AccountResetPasswordCheckEmail,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
}, {
  initialRouteName: 'CheckoutLoginRegister',
  defaultNavigationOptions,
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
      title: i18n.t('RESTAURANT'),
    }),
  },
  CheckoutProductOptions: {
    screen: screens.CheckoutProductOptions,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_PRODUCT_OPTIONS_TITLE'),
    }),
  },
  CheckoutShippingDate: {
    screen: screens.CheckoutShippingDate,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_SHIPPING_DATE'),
    }),
  },
  CheckoutLogin: {
    screen: LoginRegisterStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_LOGIN_TITLE'),
    }),
  },
  CheckoutMoreInfos: {
    screen: screens.CheckoutMoreInfos,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CHECKOUT_MORE_INFOS'),
    }),
  },
}, {
  mode: 'modal',
  defaultNavigationOptions,
})
