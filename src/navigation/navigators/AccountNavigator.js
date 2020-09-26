import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import { selectIsAuthenticated } from '../../redux/App/selectors'

const Stack = createStackNavigator()

/*
export default createStackNavigator({
  AccountHome: {
    screen: screens.AccountHome,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
  // Authenticated
  AccountAddresses: {
    screen: screens.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ADDRESSES'),
    }),
  },
  AccountOrders: {
    screen: screens.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ORDERS'),
    }),
  },
  AccountOrder: {
    screen: screens.AccountOrderPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_NUMBER', { number: navigation.state.params.order.number }),
    }),
  },
  AccountDetails: {
    screen: screens.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    }),
  },
  // Not authenticated
  AccountRegisterCheckEmail: {
    screen: screens.AccountRegisterCheckEmail,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CHECK_EMAIL'),
    }),
  },
  AccountForgotPassword: {
    screen: screens.AccountForgotPassword,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('FORGOT_PASSWORD'),
    }),
  },
  AccountResetPasswordCheckEmail: {
    screen: screens.AccountResetPasswordCheckEmail,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESET_PASSWORD_CHECK_EMAIL'),
    }),
  },
}, {
  initialRouteKey: 'AccountHome',
  initialRouteName: 'AccountHome',
  defaultNavigationOptions,
})
*/

function mapStateToProps(state) {

  return {
    isAuthenticated: selectIsAuthenticated(state),
  }
}

const MainStack = withTranslation()(({ t, isAuthenticated }) => (
  <Stack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    { isAuthenticated && (
      <>
        <Stack.Screen
          name="AccountHome"
          component={ screens.AccountHome }
          options={ ({ navigation, route }) => ({
            title: t('MY_ACCOUNT'),
            headerLeft: headerLeft(navigation),
          })} />
        <Stack.Screen
          name="AccountAddresses"
          component={ screens.AccountAddressesPage }
          options={{
            title: t('MY_ADDRESSES'),
          }} />
        <Stack.Screen
          name="AccountDetails"
          component={ screens.AccountDetailsPage }
          options={{
            title: t('MY_DETAILS'),
          }} />
      </>
    ) }
    { !isAuthenticated && (
      <>
        <Stack.Screen
          name="AccountLoginRegister"
          component={ screens.AccountLoginRegister }
          options={ ({ navigation, route }) => ({
            title: t('MY_ACCOUNT'),
            headerLeft: headerLeft(navigation),
          })} />
      </>
    ) }
  </Stack.Navigator>
))

export default connect(mapStateToProps)(MainStack)
