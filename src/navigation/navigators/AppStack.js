import React, { Component } from 'react'
import { Icon, Text } from 'native-base'
import { createStackNavigator } from 'react-navigation'

import i18n from '../../i18n'
import { primaryColor,  whiteColor, fontTitleName } from '../../styles/common'
import navigation from '..'
import HomeTab from './HomeTab'
import HeaderButton from '../../components/HeaderButton'
import RestaurantStatusButton from '../../components/RestaurantStatusButton'

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: primaryColor,
  },
  headerBackTitleStyle: {
    color: whiteColor,
    fontWeight: 'normal',
    fontFamily: fontTitleName
  },
  headerTintColor: whiteColor,
  headerTitleStyle: {
    color: whiteColor,
    // fontWeight needs to be defined or it doesn't work
    // @see https://github.com/react-community/react-navigation/issues/542#issuecomment-345289122
    fontWeight: 'normal',
    fontFamily: fontTitleName
  },
}

const homeIconHeaderLeft = navigation => {
  return (
    <HeaderButton iconName="home" onPress={ () => navigation.goBack() } />
  )
}

const restaurantStatusHeaderRight = navigation => {
  return (
    <RestaurantStatusButton navigation={ navigation } />
  )
}

const MainNavigator = createStackNavigator({
  Home: {
    screen: HomeTab,
  },
  AccountAddresses: {
    screen: navigation.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ADDRESSES'),
    })
  },
  AccountOrders: {
    screen: navigation.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ORDERS'),
    })
  },
  AccountDetails: {
    screen: navigation.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    })
  },
  Courier: {
    screen: navigation.CourierPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: homeIconHeaderLeft(navigation)
    })
  },
  CourierTasks: {
    screen: navigation.CourierTasksPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS'),
    })
  },
  CourierTaskList: {
    screen: navigation.CourierTaskListPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASK_LIST'),
    })
  },
  CourierTask: {
    screen: navigation.CourierTaskPage,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    })
  },
  CourierTaskHistory: {
    screen: navigation.CourierTaskHistoryPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('HISTORY'),
    })
  },
  CourierSettings: {
    screen: navigation.CourierSettingsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    })
  },
  Restaurant: {
    screen: navigation.RestaurantPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT'),
    })
  },
  RestaurantList: {
    screen: navigation.RestaurantList,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANTS'),
      headerLeft: homeIconHeaderLeft(navigation),
    })
  },
  RestaurantDashboard: {
    screen: navigation.RestaurantDashboard,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.restaurant.name,
      headerRight: restaurantStatusHeaderRight(navigation),
    })
  },
  RestaurantOrder: {
    screen: navigation.RestaurantOrder,
    navigationOptions: ({ navigation }) => ({
      title: `#${navigation.state.params.order.id}`,
    })
  },
  Cart: {
    screen: navigation.CartPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CART'),
    })
  },
  CartAddress: {
    screen: navigation.CartAddressPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DELIVERY_ADDR'),
    })
  },
  CreditCard: {
    screen: navigation.CreditCardPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    })
  },
  OrderTracking: {
    screen: navigation.OrderTrackingPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_TRACKING'),
    })
  },
}, {
  initialRouteKey: 'Home',
  initialRouteName: 'Home',
  navigationOptions: {
    ...defaultNavigationOptions
  }
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
  },
  RestaurantOrderRefuse: {
    screen: navigation.RestaurantOrderRefuse,
  },
  RestaurantOrderDelay: {
    screen: navigation.RestaurantOrderDelay,
  },
  RestaurantOrderCancel: {
    screen: navigation.RestaurantOrderCancel,
  },
  RestaurantDate: {
    screen: navigation.RestaurantDate,
  },
  RestaurantStatus: {
    screen: navigation.RestaurantStatus,
  }
}, {
  mode: 'modal',
  headerMode: 'none',
})
