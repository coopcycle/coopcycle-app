import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import i18n from '../../i18n'

const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <Stack.Screen
      name="AccountHome"
      component={ screens.AccountHome }
      options={ ({ navigation }) => ({
        title: i18n.t('MY_ACCOUNT'),
        headerLeft: headerLeft(navigation),
      })}
    />
    <Stack.Screen
      name="AccountAddresses"
      component={ screens.AccountAddressesPage }
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <Stack.Screen
      name="AccountOrders"
      component={ screens.AccountOrdersPage }
      options={{
        title: i18n.t('MY_ORDERS'),
      }}
    />
    <Stack.Screen
      name="AccountOrder"
      component={ screens.AccountOrderPage }
      options={ ({ route }) => ({
        title: i18n.t('ORDER_NUMBER', { number: route.params.order.number }),
      })}
    />
    <Stack.Screen
      name="AccountDetails"
      component={ screens.AccountDetailsPage }
      options={{
        title: i18n.t('MY_DETAILS'),
      }}
    />
    <Stack.Screen
      name="AccountRegisterCheckEmail"
      component={ screens.AccountRegisterCheckEmail }
      options={{
        title: i18n.t('REGISTER_CHECK_EMAIL'),
      }}
    />
    <Stack.Screen
      name="AccountForgotPassword"
      component={ screens.AccountForgotPassword }
      options={{
        title: i18n.t('FORGOT_PASSWORD'),
      }}
    />
    <Stack.Screen
      name="AccountResetPasswordCheckEmail"
      component={ screens.AccountResetPasswordCheckEmail }
      options={{
        title: i18n.t('RESET_PASSWORD_CHECK_EMAIL'),
      }}
    />
  </Stack.Navigator>
)
