import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import HeaderButton from '../components/HeaderButton';

import DispatchAddTask from './dispatch/AddTask';
import DispatchAssignTask from './dispatch/AssignTask';
import DispatchDate from './dispatch/Date';
import DispatchEditAddress from './dispatch/EditAddress';
import DispatchPickUser from './dispatch/PickUser';
import DispatchTaskList from './dispatch/TaskList';
import DispatchTaskLists from './dispatch/TaskLists';
import DispatchUnassignedTasks from './dispatch/UnassignedTasks';

import TaskComplete from './task/Complete';
import TaskPhoto from './task/Photo';
import TaskSignature from './task/Signature';
import TaskHome from './task/Task';

import StoreDashboard from './store/Dashboard';
import StoreDelivery from './store/Delivery';
import StoreNewDeliveryAddress from './store/NewDeliveryAddress';
import StoreNewDeliveryForm from './store/NewDeliveryForm';

import CheckoutPaymentMethodCard from './checkout/PaymentMethodCard';
import CheckoutPaymentMethodCashOnDelivery from './checkout/PaymentMethodCashOnDelivery';

import AccountAddressesPage from './account/AccountAddressesPage';
import AccountDetailsPage from './account/AccountDetailsPage';
import AccountOrdersPage from './account/AccountOrdersPage';
import AccountForgotPassword from './account/ForgotPassword';
import AccountHome from './account/Home';
import AccountLoginRegister from './account/LoginRegister';
import AccountOrderPage from './account/Order';
import AccountRegisterCheckEmail from './account/RegisterCheckEmail';
import AccountRegisterConfirm from './account/RegisterConfirm';
import AccountResetPasswordCheckEmail from './account/ResetPasswordCheckEmail';
import AccountResetPasswordNewPassword from './account/ResetPasswordNewPassword';

import CourierDate from './courier/Date';
import CourierSettings from './courier/Settings';
import CourierSettingsTags from './courier/Tags';
import CourierTaskListPage from './courier/TaskListPage';
import CourierTasksPage from './courier/TasksPage';

import CheckoutCreditCard from './checkout/CreditCard';
import CheckoutLogin from './checkout/Login';
import CheckoutMercadopago from './checkout/Mercadopago';
import CheckoutMoreInfos from './checkout/MoreInfos';
import CheckoutProductDetails from './checkout/ProductDetails';
import CheckoutShippingDate from './checkout/ShippingDate';
import CheckoutSummary from './checkout/Summary';

import CheckoutLoopeat from './checkout/Loopeat';
import CheckoutRestaurant from './checkout/Restaurant';
import RestaurantsPage from './checkout/Search';
import SearchForm from './checkout/SearchForm';

import AddressDetails from './account/AddressDetails';
import Carts from './checkout/Carts';
import OrderTrackingPage from './checkout/OrderTracking';
import RestaurantDashboard from './restaurant/Dashboard';
import RestaurantDate from './restaurant/Date';
import RestaurantList from './restaurant/List';
import RestaurantLoopeatFormats from './restaurant/LoopeatFormats';
import RestaurantMenus from './restaurant/Menus';
import RestaurantOpeningHours from './restaurant/OpeningHours';
import RestaurantOrder from './restaurant/Order';
import RestaurantOrderCancel from './restaurant/OrderCancel';
import RestaurantOrderDelay from './restaurant/OrderDelay';
import RestaurantOrderRefuse from './restaurant/OrderRefuse';
import RestaurantPrinter from './restaurant/Printer';
import RestaurantProducts from './restaurant/Products';
import RestaurantSettings from './restaurant/Settings';

import Delivery from './delivery/Delivery';

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
  RestaurantLoopeatFormats,
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
  CourierDate,
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
  Delivery,
};

export const headerLeft = (navigation, testID = 'menuBtn') => {
  return () => (
    <HeaderButton
      iconName="menu"
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      testID={testID}
    />
  );
};
