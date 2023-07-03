import React from 'react'
import HeaderButton from '../components/HeaderButton'
import { DrawerActions } from '@react-navigation/native'

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

import CheckoutProductDetails from './checkout/ProductDetails'
import CheckoutLogin from './checkout/Login'
import CheckoutSummary from './checkout/Summary'
import CheckoutShippingDate from './checkout/ShippingDate'
import CheckoutCreditCard from './checkout/CreditCard'
import CheckoutMoreInfos from './checkout/MoreInfos'
import CheckoutMercadopago from './checkout/Mercadopago'

import RestaurantsPage from './checkout/Search'
import CheckoutRestaurant from './checkout/Restaurant'
import SearchForm from './checkout/SearchForm'
import CheckoutLoopeat from './checkout/Loopeat'

import RestaurantList from './restaurant/List'
import RestaurantDashboard from './restaurant/Dashboard'
import RestaurantOrder from './restaurant/Order'
import RestaurantOrderRefuse from './restaurant/OrderRefuse'
import RestaurantOrderDelay from './restaurant/OrderDelay'
import RestaurantOrderCancel from './restaurant/OrderCancel'
import RestaurantDate from './restaurant/Date'
import RestaurantSettings from './restaurant/Settings'
import RestaurantProducts from './restaurant/Products'
import RestaurantOpeningHours from './restaurant/OpeningHours'
import RestaurantMenus from './restaurant/Menus'
import RestaurantPrinter from './restaurant/Printer'
import Carts from './checkout/Carts';
import AddressDetails from './account/AddressDetails';
import OrderTrackingPage from './checkout/OrderTracking';

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
  CheckoutProductDetails,
  CheckoutLogin,
  CheckoutSummary,
  CheckoutShippingDate,
  CheckoutCreditCard,
  CheckoutMercadopago,
  CheckoutMoreInfos,
  CourierTasksPage,
  CourierTaskListPage,
  CourierSettings,
  CourierSettingsTags,
  CheckoutPaymentMethodCard,
  CheckoutPaymentMethodCashOnDelivery,
  CheckoutLoopeat,
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
  SearchForm,
  Carts,
  AddressDetails,
  OrderTrackingPage,
}

export const headerLeft = (navigation, testID = 'menuBtn') => {
  return () => <HeaderButton iconName="menu" onPress={ () => navigation.dispatch(DrawerActions.toggleDrawer()) } testID={ testID } />
}
