import React from 'react'
import HeaderButton from '../components/HeaderButton'

import RestaurantsPage from './checkout/Search'
import CheckoutRestaurant from './checkout/Restaurant'

// import DispatchUnassignedTasks from './dispatch/UnassignedTasks'
// import DispatchTaskLists from './dispatch/TaskLists'
// import DispatchTaskList from './dispatch/TaskList'
// import DispatchPickUser from './dispatch/PickUser'
// import DispatchAddTask from './dispatch/AddTask'
// import DispatchDate from './dispatch/Date'
// import DispatchEditAddress from './dispatch/EditAddress'
// import DispatchAssignTask from './dispatch/AssignTask'

import TaskHome from './task/Task'
import TaskComplete from './task/Complete'
import TaskPhoto from './task/Photo'
import TaskSignature from './task/Signature'

// import StoreDashboard from './store/Dashboard'
// import StoreDelivery from './store/Delivery'
// import StoreNewDeliveryAddress from './store/NewDeliveryAddress'
// import StoreNewDeliveryForm from './store/NewDeliveryForm'

import AccountHome from './account/Home'
import AccountLoginRegister from './account/LoginRegister'
import AccountAddressesPage from './account/AccountAddressesPage'
import AccountDetailsPage from './account/AccountDetailsPage'
import AccountRegisterCheckEmail from './account/RegisterCheckEmail'
import AccountRegisterConfirm from './account/RegisterConfirm'
import AccountForgotPassword from './account/ForgotPassword'
import AccountResetPasswordCheckEmail from './account/ResetPasswordCheckEmail'

import CourierTasksPage from './courier/TasksPage'
import CourierTaskListPage from './courier/TaskListPage'
import CourierSettings from './courier/Settings'
import CourierSettingsTags from './courier/Tags'

import RestaurantList from './restaurant/List'
import RestaurantDashboard from './restaurant/Dashboard'
import RestaurantOrder from './restaurant/Order'
import RestaurantOrderRefuse from './restaurant/OrderRefuse'
import RestaurantOrderDelay from './restaurant/OrderDelay'
import RestaurantOrderCancel from './restaurant/OrderCancel'
import RestaurantSettings from './restaurant/Settings'
import RestaurantDate from './restaurant/Date'
import RestaurantProducts from './restaurant/Products'
import RestaurantOpeningHours from './restaurant/OpeningHours'
import RestaurantMenus from './restaurant/Menus'
import RestaurantPrinter from './restaurant/Printer'

import CheckoutProductOptions from './checkout/ProductOptions'
import CheckoutLogin from './checkout/Login'
import CheckoutSummary from './checkout/Summary'
import CheckoutShippingDate from './checkout/ShippingDate'
import CheckoutCreditCard from './checkout/CreditCard'
import CheckoutMoreInfos from './checkout/MoreInfos'

export default {
  RestaurantsPage,
  CheckoutRestaurant,
  RestaurantList,
  RestaurantDashboard,
  RestaurantOrder,
  RestaurantOrderRefuse,
  RestaurantOrderDelay,
  RestaurantOrderCancel,
  RestaurantDate,
  RestaurantSettings,
  RestaurantProducts,
  RestaurantOpeningHours,
  RestaurantMenus,
  RestaurantPrinter,
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
  AccountHome,
  AccountLoginRegister,
  AccountAddressesPage,
  // AccountOrdersPage: require('./account/AccountOrdersPage'),
  // AccountOrderPage: require('./account/Order'),
  AccountDetailsPage,
  AccountRegisterCheckEmail,
  AccountRegisterConfirm,
  AccountForgotPassword,
  AccountResetPasswordCheckEmail,
  // AccountResetPasswordNewPassword: require('./account/ResetPasswordNewPassword'),
  // DispatchUnassignedTasks,
  // DispatchTaskLists,
  // DispatchTaskList,
  // DispatchPickUser,
  // DispatchAddTask,
  // DispatchDate,
  // DispatchAssignTask,
  // DispatchEditAddress,
  TaskHome,
  TaskComplete,
  TaskPhoto,
  TaskSignature,
  // StoreDashboard,
  // StoreDelivery,
  // StoreNewDeliveryAddress,
  // StoreNewDeliveryForm,
  // Loading: require('./Loading'),
  // ConfigureServer: require('./ConfigureServer'),
}

export const headerLeft = (navigation, testID = 'menuBtn') => {
  return () => <HeaderButton iconName="menu" onPress={ () => navigation.toggleDrawer() } testID={ testID } />
}

let navigateAfter = null

export const navigateToTask = (navigation, route, task, tasks = []) => {

  if (route.name !== 'TaskHome') {
    navigateAfter = route.name
  }

  const params = {
    task,
    tasks,
    navigateAfter,
  }

  navigation.navigate('Task', { screen: 'TaskHome', params })
}

export const navigateToCompleteTask = (navigation, route, task, tasks = [], success = true) => {

  const params = {
    task,
    navigateAfter: route.name,
  }

  navigation.navigate('Task', {
    screen: 'TaskComplete',
    params: {
      screen: 'TaskCompleteHome',
      params: { ...params, success },
    },
  })
}
