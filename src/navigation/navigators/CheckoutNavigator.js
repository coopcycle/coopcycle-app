import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text } from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'
import { createCollapsibleStackSub } from 'react-navigation-collapsible'

import { stackNavigatorScreenOptions } from '../styles'
import screens, { headerLeft } from '..'

const MainStack = createStackNavigator()
const LoginRegisterStack = createStackNavigator()
const RootStack = createStackNavigator()

const LoginRegisterScreen = withTranslation()(({ t }) => (
  <LoginRegisterStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <LoginRegisterStack.Screen
      name="CheckoutLoginRegister"
      component={ screens.CheckoutLogin }
      options={{ headerShown: false }} />
    <LoginRegisterStack.Screen
      name="CheckoutCheckEmail"
      component={ screens.AccountRegisterCheckEmail }
      options={{ headerShown: false }} />
    <LoginRegisterStack.Screen
      name="CheckoutForgotPassword"
      component={ screens.AccountForgotPassword }
      options={{ headerShown: false }} />
    <LoginRegisterStack.Screen
      name="CheckoutResetPasswordCheckEmail"
      component={ screens.AccountResetPasswordCheckEmail }
      options={{ headerShown: false }} />
  </LoginRegisterStack.Navigator>
))

const MainStackScreen = withTranslation()(({ t }) => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="CheckoutHome"
      component={ screens.RestaurantsPage }
      options={ ({ navigation, route }) => ({
        title: t('RESTAURANTS'),
        headerLeft: headerLeft(navigation),
      })} />
    { createCollapsibleStackSub(
      <MainStack.Screen
        name="CheckoutRestaurant"
        component={ screens.CheckoutRestaurant }
        options={ ({ navigation, route }) => ({
          title: t('RESTAURANT'),
        })} />,
      {
        collapsedColor: 'red' /* Optional */,
        useNativeDriver: true /* Optional, default: true */,
        key: 'CheckoutRestaurant' /* Optional, a key for your Stack.Screen element */,
        elevation: 4 /* Optional */,
      }
    )}
    <MainStack.Screen
      name="CheckoutSummary"
      component={ screens.CheckoutSummary }
      options={ ({ navigation, route }) => ({
        title: t('CART'),
        headerRight: () =>
          <TouchableOpacity style={{ paddingHorizontal: 10 }}
            onPress={ () => navigation.setParams({ edit: !(route.params?.edit ?? false) }) }>
            <Text style={{ color: 'white' }}>
              { (route.params?.edit ?? false) ? t('FINISHED') : t('EDIT') }
            </Text>
          </TouchableOpacity>
        ,
      })} />
    <MainStack.Screen
      name="CheckoutCreditCard"
      component={ screens.CheckoutCreditCard }
      options={ ({ navigation, route }) => ({
        title: t('PAYMENT'),
      })} />
  </MainStack.Navigator>
))

export default withTranslation()(({ t }) => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    mode="modal">
    <RootStack.Screen
      name="Main"
      component={ MainStackScreen }
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="CheckoutProductOptions"
      component={ screens.CheckoutProductOptions }
      options={{
        title: t('CHECKOUT_PRODUCT_OPTIONS_TITLE'),
      }} />
    <RootStack.Screen
      name="CheckoutShippingDate"
      component={ screens.CheckoutShippingDate }
      options={{
        title: t('CHECKOUT_SHIPPING_DATE'),
      }} />
    <RootStack.Screen
      name="CheckoutLogin"
      component={ LoginRegisterScreen }
      options={{
        title: t('CHECKOUT_LOGIN_TITLE'),
      }} />
    <RootStack.Screen
      name="CheckoutMoreInfos"
      component={ screens.CheckoutMoreInfos }
      options={{
        title: t('CHECKOUT_MORE_INFOS'),
      }} />
  </RootStack.Navigator>
))
