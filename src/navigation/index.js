import React from 'react'
import HeaderButton from '../components/HeaderButton'
import { primaryColor,  whiteColor, fontTitleName } from '../styles/common'
import { DrawerActions } from '@react-navigation/compat'

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

import CheckoutPaymentMethodCard from './checkout/PaymentMethodCard'
import CheckoutPaymentMethodCashOnDelivery from './checkout/PaymentMethodCashOnDelivery'

import AccountHome from './account/Home'
import AccountLoginRegister from './account/LoginRegister'
import AccountAddressesPage from './account/AccountAddressesPage'
import AccountOrdersPage from './account/AccountOrdersPage'
import AccountOrderPage from './account/Order'
import AccountDetailsPage from './account/AccountDetailsPage'
import AccountRegisterCheckEmail from './account/RegisterCheckEmail'
import AccountRegisterConfirm from './account/RegisterConfirm'
import AccountForgotPassword from './account/ForgotPassword'
import AccountResetPasswordCheckEmail from './account/ResetPasswordCheckEmail'
import AccountResetPasswordNewPassword from './account/ResetPasswordNewPassword'

import CourierTasksPage from './courier/TasksPage'
import CourierTaskListPage from './courier/TaskListPage'
import CourierSettings from './courier/Settings'
import CourierSettingsTags from './courier/Tags'

import CheckoutProductOptions from './checkout/ProductOptions'
import CheckoutLogin from './checkout/Login'
import CheckoutSummary from './checkout/Summary'
import CheckoutShippingDate from './checkout/ShippingDate'
import CheckoutCreditCard from './checkout/CreditCard'
import CheckoutMoreInfos from './checkout/MoreInfos'

import RestaurantsPage from './checkout/Search'
import CheckoutRestaurant from './checkout/Restaurant'

export default {
  RestaurantsPage,
  CheckoutRestaurant,
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
  CheckoutProductOptions,
  CheckoutLogin,
  CheckoutSummary,
  CheckoutShippingDate,
  CheckoutCreditCard,
  CheckoutMoreInfos,
  CourierTasksPage,
  CourierTaskListPage,
  CourierSettings,
  CourierSettingsTags,
  CheckoutPaymentMethodCard,
  CheckoutPaymentMethodCashOnDelivery,
  AccountHome,
  AccountLoginRegister,
  AccountAddressesPage,
  AccountOrdersPage,
  AccountOrderPage,
  AccountDetailsPage,
  AccountRegisterCheckEmail,
  AccountRegisterConfirm,
  AccountForgotPassword,
  AccountResetPasswordCheckEmail,
  AccountResetPasswordNewPassword,
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
  return () => <HeaderButton iconName="menu" onPress={ () => navigation.dispatch(DrawerActions.toggleDrawer()) } testID={ testID } />
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

  navigation.navigate('Task', {
    screen: 'TaskHome',
    params,
  })
}

export const navigateToCompleteTask = (navigation, task, tasks = [], success = true) => {

  const params = {
    task,
    navigateAfter: navigation.state.routeName,
  }

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: { ...params, success }
  })
}
