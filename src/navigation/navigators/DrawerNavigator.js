import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'
import { connect } from 'react-redux'

import i18n from '../../i18n'
import { selectIsAuthenticated, selectInitialRouteName } from '../../redux/App/selectors'
import { defaultNavigationOptions, headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'

import DrawerContent from '../components/DrawerContent'

import AccountNavigator from './AccountNavigator'
import CheckoutNavigator from './CheckoutNavigator'
import CourierNavigator from './CourierNavigator'
import DispatchNavigator from './DispatchNavigator'
import RestaurantNavigator from './RestaurantNavigator'
import StoreNavigator from './StoreNavigator'
import About from '../home/About'
import AccountRegisterConfirm from '../account/RegisterConfirm'
import AccountResetPasswordNewPassword from '../account/ResetPasswordNewPassword'

const RegisterConfirmStack = createCompatNavigatorFactory(createStackNavigator)({
  RegisterConfirmHome: {
    screen: AccountRegisterConfirm,
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

const ResetPasswordStack = createCompatNavigatorFactory(createStackNavigator)({
  ResetPasswordHome: {
    screen: AccountResetPasswordNewPassword,
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

const Stack = createStackNavigator()

const AboutStack = () => (
  <Stack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <Stack.Screen
      name="AboutHome"
      component={ About }
      options={({ navigation }) => ({
        title: i18n.t('ABOUT'),
        headerLeft: headerLeft(navigation),
      })}
    />
  </Stack.Navigator>
)

function mapStateToProps(state) {

  const user = state.app.user

  return {
    isAuthenticated: selectIsAuthenticated(state),
    user,
    initialRouteName: selectInitialRouteName(state),
  }
}

const Drawer = createDrawerNavigator()

const DrawerNav = ({ initialRouteName, user, isAuthenticated }) => {

  return (
    <Drawer.Navigator
      drawerContent={ (props) => <DrawerContent { ...props } /> }
      initialRouteName={ initialRouteName }
      >
      <Drawer.Screen
        name="CheckoutNav"
        component={ CheckoutNavigator } />
      <Drawer.Screen
        name="AccountNav"
        component={ AccountNavigator } />
      <Drawer.Screen
        name="AboutNav"
        component={ AboutStack } />
      <Drawer.Screen
        name="RegisterConfirmNav"
        component={ RegisterConfirmStack } />
      <Drawer.Screen
        name="ResetPasswordNav"
        component={ ResetPasswordStack } />

      { (isAuthenticated && user.hasRole('ROLE_COURIER')) && (
        <Drawer.Screen
          name="CourierNav"
          component={ CourierNavigator } />
      )}
      { (isAuthenticated && user.hasRole('ROLE_RESTAURANT')) && (
        <Drawer.Screen
          name="RestaurantNav"
          component={ RestaurantNavigator } />
      )}
      { (isAuthenticated && user.hasRole('ROLE_STORE')) && (
        <Drawer.Screen
          name="StoreNav"
          component={ StoreNavigator } />
      )}
      { (isAuthenticated && user.hasRole('ROLE_ADMIN')) && (
        <Drawer.Screen
          name="DispatchNav"
          component={ DispatchNavigator } />
      )}
    </Drawer.Navigator>
  )
}

export default connect(mapStateToProps)(DrawerNav)
