import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { selectIsAuthenticated } from '../../redux/App/selectors'

import DrawerContent from '../components/DrawerContent'

import AccountNavigator from './AccountNavigator'
import CheckoutNavigator from './CheckoutNavigator'
import CourierNavigator from './CourierNavigator'
// import DispatchNavigator from './DispatchNavigator'
import RestaurantNavigator from './RestaurantNavigator'
// import StoreNavigator from './StoreNavigator'
// import About from '../home/About'

/*
const RegisterConfirmStack = createStackNavigator({
  RegisterConfirmHome: {
    screen: screens.AccountRegisterConfirm,
    path: 'confirm/:token',
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('REGISTER_CONFIRM'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
}, {
  initialRouteName: 'RegisterConfirmHome',
  defaultNavigationOptions,
})

const ResetPasswordStack = createStackNavigator({
  ResetPasswordHome: {
    screen: screens.AccountResetPasswordNewPassword,
    path: 'reset/:token',
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESET_PASSWORD_NEW_PASSWORD'),
      headerLeft: headerLeft(navigation),
      ...defaultNavigationOptions,
    }),
  },
}, {
  initialRouteName: 'ResetPasswordHome',
  defaultNavigationOptions,
})

const AboutStack = createStackNavigator({
  AboutHome: {
    screen: About,
    navigationOptions: ({ navigation }) => {

      return {
        title: i18n.t('ABOUT'),
        headerLeft: headerLeft(navigation),
      }
    },
  },
}, {
  initialRouteName: 'AboutHome',
  defaultNavigationOptions,
})

export default createDrawerNavigator({
  CheckoutNav: {
    screen: CheckoutNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('SEARCH'),
    }),
  },
  AccountNav: {
    screen: AccountNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('MY_ACCOUNT'),
    }),
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
    }),
  },
  StoreNav: {
    screen: StoreNavigator,
    navigationOptions: ({ navigation }) => ({
      // This route is "dynamic", it may appear several times
      // @see src/navigation/components/DrawerContent.js
      drawerLabel: '',
      drawerIcon: ({ tintColor }) => (
        <Icon name="shopping-cart" type="FontAwesome" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  CourierNav: {
    screen: CourierNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('TASKS'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  DispatchNav: {
    screen: DispatchNavigator,
    navigationOptions: ({ navigation }) => ({
      drawerLabel: i18n.t('DISPATCH'),
      drawerIcon: ({ tintColor }) => (
        <Icon name="bicycle" style={{ fontSize: 16, color: tintColor }} />
      ),
    }),
  },
  AboutNav: {
    screen: AboutStack,
  },
  // This screen will not appear in drawer, but handle an activate account deep link
  // We need to put it here to be accessible from everywhere
  RegisterConfirmNav: {
    screen: RegisterConfirmStack,
    path: '/register',
  },
  // This screen will not appear in drawer, but handle a reset password deep link
  // We need to put it here to be accessible from everywhere
  ResetPasswordNav: {
    screen: ResetPasswordStack,
    path: '/resetting',
  },
}, {
  contentComponent: DrawerContent,
})
*/

function mapStateToProps(state) {

  const user = state.app.user
  const restaurants = state.restaurant.myRestaurants

  let initialRouteName = 'CheckoutNav'

  if (user && user.isAuthenticated()) {

    if (user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT') || user.hasRole('ROLE_STORE')) {

      if (restaurants.length > 0) {
        initialRouteName = 'RestaurantNav'
      }

    } else if (user.hasRole('ROLE_COURIER')) {
      initialRouteName = 'CourierNav'
    } else {
      // NavigationHolder.navigate('CheckoutHome')
    }
  } else {
    // NavigationHolder.navigate('CheckoutHome')
  }

  console.log('initialRouteName', initialRouteName)

  return {
    isAuthenticated: selectIsAuthenticated(state),
    user,
    initialRouteName,
  }
}

const Drawer = createDrawerNavigator()

const DrawerNav = withTranslation()(({ t, initialRouteName, user, isAuthenticated }) => {

  return (
    <Drawer.Navigator
      drawerContent={ (props) => <DrawerContent { ...props } /> }
      initialRouteName={ initialRouteName }
      >
      <Drawer.Screen
        name="CheckoutNav"
        component={ CheckoutNavigator }
        options={{
          title: t('SEARCH'),
        }} />
      <Drawer.Screen
        name="AccountNav"
        component={ AccountNavigator } />
      { (isAuthenticated && user.hasRole('ROLE_COURIER')) && (
        <Drawer.Screen
        name="CourierNav"
        component={ CourierNavigator }
        options={{
          title: t('TASKS'),
        }} />
      )}
      { (isAuthenticated && user.hasRole('ROLE_RESTAURANT')) && (
        <Drawer.Screen
        name="RestaurantNav"
        component={ RestaurantNavigator }
        options={{
          // This route is "dynamic", it may appear several times
          // @see src/navigation/components/DrawerContent.js
          title: '',
        }} />
      )}
    </Drawer.Navigator>
  )
})

export default connect(mapStateToProps)(DrawerNav)
