import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Text} from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'

import i18n from '../../i18n'
import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'

const MainStack = createStackNavigator()

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="CheckoutHome"
      component={ screens.RestaurantsPage }
      options={ ({ navigation }) => ({
        title: i18n.t('RESTAURANTS'),
        headerLeft: headerLeft(navigation),
      })}
    />
    <MainStack.Screen
      name="CheckoutRestaurant"
      component={ screens.CheckoutRestaurant }
      options={{
        title: i18n.t('RESTAURANT'),
      }}
    />
    <MainStack.Screen
      name="CheckoutSummary"
      component={ screens.CheckoutSummary }
      options={ ({ navigation, route }) => ({
        title: i18n.t('CART'),
        headerRight: () => (
          <TouchableOpacity style={{ paddingHorizontal: 10 }}
            onPress={ () => {
              navigation.setParams({ edit: !(route.params?.edit || false) })
            }}>
            <Text style={{ color: 'white' }}>
              { (route.params?.edit || false) ? i18n.t('FINISHED') : i18n.t('EDIT') }
            </Text>
          </TouchableOpacity>
        ),
      })}
    />
    <MainStack.Screen
      name="CheckoutCreditCard"
      component={ screens.CheckoutCreditCard }
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
    <MainStack.Screen
      name="CheckoutMercadopago"
      component={ screens.CheckoutMercadopago }
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
  </MainStack.Navigator>
)

const LoginRegisterStack = createStackNavigator()

const LoginRegisterNavigator = () => (
  <LoginRegisterStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <LoginRegisterStack.Screen
      name="CheckoutLoginRegister"
      component={ screens.CheckoutLogin }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutCheckEmail"
      component={ screens.AccountRegisterCheckEmail }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutForgotPassword"
      component={ screens.AccountForgotPassword }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutResetPasswordCheckEmail"
      component={ screens.AccountResetPasswordCheckEmail }
      options={{
        headerShown: false,
      }}
    />
  </LoginRegisterStack.Navigator>
)

const RootStack = createStackNavigator()

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="Main"
      component={ MainNavigator }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT'),
      }}
    />
    <RootStack.Screen
      name="CheckoutProductDetails"
      component={ screens.CheckoutProductDetails }
      options={{
        title: '',
      }}
    />
    <RootStack.Screen
      name="CheckoutShippingDate"
      component={ screens.CheckoutShippingDate }
      options={{
        title: i18n.t('CHECKOUT_SHIPPING_DATE'),
      }}
    />
    <RootStack.Screen
      name="CheckoutLogin"
      component={ LoginRegisterNavigator }
      options={{
        title: i18n.t('CHECKOUT_LOGIN_TITLE'),
      }}
    />
    <RootStack.Screen
      name="CheckoutMoreInfos"
      component={ screens.CheckoutMoreInfos }
      options={{
        title: i18n.t('CHECKOUT_MORE_INFOS'),
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCard"
      component={ screens.CheckoutPaymentMethodCard }
      options={{
        title: i18n.t('PAYMENT_METHOD.card'),
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCashOnDelivery"
      component={ screens.CheckoutPaymentMethodCashOnDelivery }
      options={{
        title: i18n.t('PAYMENT_METHOD.cash_on_delivery'),
      }}
    />
  </RootStack.Navigator>
)
