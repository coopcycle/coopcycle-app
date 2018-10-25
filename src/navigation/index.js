import React from 'react'
import { View } from 'react-native'
import { Icon } from 'native-base'

import Home from './Home'
import { primaryColor,  whiteColor, fontTitleName } from '../styles/common'

export default {
  RestaurantsPage: require('./RestaurantsPage'),
  RestaurantPage: require('./RestaurantPage'),
  RestaurantList: require('./restaurant/List'),
  RestaurantDashboard: require('./restaurant/Dashboard'),
  RestaurantOrder: require('./restaurant/Order'),
  RestaurantOrderRefuse: require('./restaurant/OrderRefuse'),
  RestaurantOrderDelay: require('./restaurant/OrderDelay'),
  RestaurantOrderCancel: require('./restaurant/OrderCancel'),
  RestaurantDate: require('./restaurant/Date'),
  RestaurantSettings: require('./restaurant/Settings'),
  RestaurantProducts: require('./restaurant/Products'),
  RestaurantOpeningHours: require('./restaurant/OpeningHours'),
  CheckoutProductOptions: require('./checkout/ProductOptions'),
  CheckoutEditItem: require('./checkout/EditItem'),
  CheckoutLogin: require('./checkout/Login'),
  CartPage: require('./CartPage'),
  CartAddressPage: require('./CartAddressPage'),
  CourierPage: require('./CourierPage'),
  CourierTasksPage: require('./courier/TasksPage'),
  CourierTaskListPage: require('./courier/TaskListPage'),
  CourierTaskPage: require('./courier/TaskPage'),
  CourierTaskHistoryPage: require('./courier/TaskHistoryPage'),
  CourierSettingsPage: require('./courier/SettingsPage'),
  CourierTaskComplete: require('./courier/CompleteTask'),
  CourierFilters: require('./courier/Filters'),
  AccountPage: require('./AccountPage'),
  AccountAddressesPage: require('./account/AccountAddressesPage'),
  AccountOrdersPage: require('./account/AccountOrdersPage'),
  AccountDetailsPage: require('./account/AccountDetailsPage'),
  CreditCardPage: require('./CreditCardPage'),
  OrderTrackingPage: require('./OrderTrackingPage'),
  Loading: require('./Loading'),
  Home,
  Courier: require('./CourierPage'),
  ConfigureServer: require('./ConfigureServer')
}

export const defaultNavigationOptions = {
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

export const headerLeft = navigation => {
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <Icon style={{ color: '#fff' }} name="menu" onPress={ () => navigation.toggleDrawer() } />
    </View>
  )
}
