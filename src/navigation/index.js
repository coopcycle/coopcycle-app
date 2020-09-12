import React from 'react'
import HeaderButton from '../components/HeaderButton'
import { primaryColor,  whiteColor, fontTitleName } from '../styles/common'
import { NavigationActions } from 'react-navigation'

import DispatchUnassignedTasks from './dispatch/UnassignedTasks'
import DispatchTaskLists from './dispatch/TaskLists'
import DispatchTaskList from './dispatch/TaskList'
import DispatchPickUser from './dispatch/PickUser'
import DispatchAddTask from './dispatch/AddTask'
import DispatchDate from './dispatch/Date'
import DispatchEditAddress from './dispatch/EditAddress'
import DispatchAssignTask from './dispatch/AssignTask'

import TaskHome from './task/Task'
import TaskComplete from './task/Complete'
import TaskPhoto from './task/Photo'
import TaskSignature from './task/Signature'

import StoreDashboard from './store/Dashboard'
import StoreDelivery from './store/Delivery'
import StoreNewDeliveryAddress from './store/NewDeliveryAddress'
import StoreNewDeliveryForm from './store/NewDeliveryForm'

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
  RestaurantMenus: require('./restaurant/Menus'),
  RestaurantPrinter: require('./restaurant/Printer'),
  CheckoutProductOptions: require('./checkout/ProductOptions'),
  CheckoutLogin: require('./checkout/Login'),
  CheckoutSummary: require('./checkout/Summary'),
  CheckoutShippingDate: require('./checkout/ShippingDate'),
  CheckoutCreditCard: require('./checkout/CreditCard'),
  CheckoutMoreInfos: require('./checkout/MoreInfos'),
  CourierTasksPage: require('./courier/TasksPage'),
  CourierTaskListPage: require('./courier/TaskListPage'),
  CourierSettings: require('./courier/Settings'),
  CourierSettingsTags: require('./courier/Tags'),
  AccountHome: require('./account/Home'),
  AccountLoginRegister: require('./account/LoginRegister'),
  AccountAddressesPage: require('./account/AccountAddressesPage'),
  AccountOrdersPage: require('./account/AccountOrdersPage'),
  AccountOrderPage: require('./account/Order'),
  AccountDetailsPage: require('./account/AccountDetailsPage'),
  AccountRegisterCheckEmail: require('./account/RegisterCheckEmail'),
  AccountRegisterConfirm: require('./account/RegisterConfirm'),
  AccountForgotPassword: require('./account/ForgotPassword'),
  AccountResetPasswordCheckEmail: require('./account/ResetPasswordCheckEmail'),
  AccountResetPasswordNewPassword: require('./account/ResetPasswordNewPassword'),
  DispatchUnassignedTasks,
  DispatchTaskLists,
  DispatchTaskList,
  DispatchPickUser,
  DispatchAddTask,
  DispatchDate,
  DispatchAssignTask,
  DispatchEditAddress,
  TaskHome,
  TaskComplete,
  TaskPhoto,
  TaskSignature,
  StoreDashboard,
  StoreDelivery,
  StoreNewDeliveryAddress,
  StoreNewDeliveryForm,
  Loading: require('./Loading'),
  ConfigureServer: require('./ConfigureServer'),
}

export const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: primaryColor,
  },
  headerBackTitleStyle: {
    color: whiteColor,
    fontWeight: 'normal',
    fontFamily: fontTitleName,
  },
  headerTintColor: whiteColor,
  headerTitleStyle: {
    color: whiteColor,
    // fontWeight needs to be defined or it doesn't work
    // @see https://github.com/react-community/react-navigation/issues/542#issuecomment-345289122
    fontWeight: 'normal',
    fontFamily: fontTitleName,
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
}

export const headerLeft = (navigation, testID = 'menuBtn') => {
  return () => <HeaderButton iconName="menu" onPress={ () => navigation.toggleDrawer() } testID={ testID } />
}

let navigateAfter = null

export const navigateToTask = (navigation, task, tasks = []) => {

  if (navigation.state.routeName !== 'TaskHome') {
    navigateAfter = navigation.state.routeName
  }

  const params = {
    task,
    tasks,
    navigateAfter,
  }

  navigation.navigate({ routeName: 'Task', params, key: task['@id'] })
}

export const navigateToCompleteTask = (navigation, task, tasks = [], success = true) => {

  const params = {
    task,
    navigateAfter: navigation.state.routeName,
  }

  navigation.navigate({
    routeName: 'Task',
    params: { ...params, tasks },
    key: task['@id'],
    action: NavigationActions.navigate({
      routeName: 'TaskComplete',
      params: { ...params, success },
    }),
  })
}
