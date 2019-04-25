import React from 'react'
import { View } from 'react-native'
import { Icon } from 'native-base'
import HeaderButton from '../components/HeaderButton'

import Home from './Home'
import DispatchUnassignedTasks from './dispatch/UnassignedTasks'
import DispatchTaskLists from './dispatch/TaskLists'
import DispatchTaskList from './dispatch/TaskList'
import DispatchPickUser from './dispatch/PickUser'
import DispatchAddTask from './dispatch/AddTask'
import DispatchDate from './dispatch/Date'
import DispatchEditAddress from './dispatch/EditAddress'
import DispatchAssignTask from './dispatch/AssignTask'
import { primaryColor,  whiteColor, fontTitleName } from '../styles/common'

export default {
  RestaurantsPage: require('./checkout/Search'),
  CheckoutRestaurant: require('./checkout/Restaurant'),
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
  CheckoutLogin: require('./checkout/Login'),
  CheckoutSummary: require('./checkout/Summary'),
  CheckoutShippingDate: require('./checkout/ShippingDate'),
  CheckoutCreditCard: require('./checkout/CreditCard'),
  CheckoutAddress: require('./checkout/Address'),
  CourierTasksPage: require('./courier/TasksPage'),
  CourierTaskListPage: require('./courier/TaskListPage'),
  CourierTaskPage: require('./courier/TaskPage'),
  CourierTaskHistoryPage: require('./courier/TaskHistoryPage'),
  CourierTaskComplete: require('./courier/CompleteTask'),
  CourierSettings: require('./courier/Settings'),
  CourierSettingsTags: require('./courier/Tags'),
  CourierSignature: require('./courier/Signature'),
  CourierPhoto: require('./courier/Photo'),
  AccountHome: require('./account/Home'),
  AccountLoginRegister: require('./account/LoginRegister'),
  AccountAddressesPage: require('./account/AccountAddressesPage'),
  AccountOrdersPage: require('./account/AccountOrdersPage'),
  AccountOrderPage: require('./account/Order'),
  AccountDetailsPage: require('./account/AccountDetailsPage'),
  AccountCheckEmail: require('./account/CheckEmail'),
  AccountRegisterConfirm: require('./account/RegisterConfirm'),
  DispatchUnassignedTasks,
  DispatchTaskLists,
  DispatchTaskList,
  DispatchPickUser,
  DispatchAddTask,
  DispatchDate,
  DispatchAssignTask,
  DispatchEditAddress,
  Loading: require('./Loading'),
  Home,
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
    <HeaderButton iconName="menu" onPress={ () => navigation.toggleDrawer() } />
  )
}
