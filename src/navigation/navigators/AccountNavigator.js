import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import screens, { defaultNavigationOptions, headerLeft } from '..'
import i18n from '../../i18n'

export default createCompatNavigatorFactory(createStackNavigator)({
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
