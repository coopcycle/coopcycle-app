import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import screens, { defaultNavigationOptions, headerLeft } from '..'
import i18n from '../../i18n'

const AuthenticatedStack = createStackNavigator({
  AccountHome: {
    screen: screens.AccountHome,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
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
}, {
  initialRouteKey: 'AccountHome',
  initialRouteName: 'AccountHome',
  defaultNavigationOptions,
})

const NotAuthenticatedStack = createStackNavigator({
  AccountLoginRegister: {
    screen: screens.AccountLoginRegister,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ACCOUNT'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
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
  initialRouteName: 'AccountLoginRegister',
  defaultNavigationOptions,
})

export default createSwitchNavigator({
  AccountNotAuthenticated: NotAuthenticatedStack,
  AccountAuthenticated: AuthenticatedStack,
}, {
  initialRouteName: 'AccountNotAuthenticated',
})
