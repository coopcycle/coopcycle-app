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

import NewDeliveryAddress from './delivery/NewDeliveryAddress';
import NewDeliveryForm from './delivery/NewDeliveryForm';
import NewDeliveryPickup from './delivery/NewDeliveryPickup';
import NewDeliveryPrice from './delivery/NewDeliveryPrice';

import CheckoutPaymentMethodCard from './checkout/PaymentMethodCard';
import CheckoutPaymentMethodCashOnDelivery from './checkout/PaymentMethodCashOnDelivery';
import CheckoutPaymentMethodEdenred from './checkout/PaymentMethodEdenred';

import AccountAddressesPage from './account/AccountAddressesPage';
import AccountDetailsPage from './account/AccountDetailsPage';
import AccountOrdersPage from './account/AccountOrdersPage';
import AccountForgotPassword from './account/ForgotPassword';
import AccountHome from './account/Home';
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
import CourierBarcodePage from './courier/barcode/Barcode';
import CourierBarcodeReportPage from './courier/barcode/BarcodeReport';
import CourierBarcodeIncidentPage from './courier/barcode/BarcodeIncident';

import CheckoutLoginRegister from './checkout/CheckoutLoginRegister';
import CheckoutMercadopago from './checkout/Mercadopago';
import CheckoutMoreInfos from './checkout/MoreInfos';
import CheckoutPayment from './checkout/Payment';
import CheckoutProductDetails from './checkout/ProductDetails';
import CheckoutSummary from './checkout/Summary';
import CheckoutPaygreenReturn from './checkout/PaygreenReturn';
import CheckoutPaygreenCancel from './checkout/PaygreenCancel';

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
import RestaurantSearch from './restaurant/Search';
import RestaurantSettings from './restaurant/Settings';

import Delivery from './delivery/Delivery';
import NewDeliveryStore from './delivery/NewDeliveryStore';

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
  RestaurantSearch,
  RestaurantSettings,
  RestaurantProducts,
  RestaurantOpeningHours,
  RestaurantMenus,
  RestaurantPrinter,
  RestaurantLoopeatFormats,
  CheckoutProductDetails,
  CheckoutLoginRegister,
  CheckoutSummary,
  CheckoutPayment,
  CheckoutMercadopago,
  CheckoutMoreInfos,
  CourierTasksPage,
  CourierBarcodePage,
  CourierBarcodeReportPage,
  CourierBarcodeIncidentPage,
  CourierTaskListPage,
  CourierSettings,
  CourierSettingsTags,
  CourierDate,
  CheckoutPaymentMethodCard,
  CheckoutPaymentMethodCashOnDelivery,
  CheckoutPaymentMethodEdenred,
  CheckoutLoopeat,
  CheckoutPaygreenReturn,
  CheckoutPaygreenCancel,
  AccountHome,
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
  NewDeliveryStore,
  NewDeliveryPickup,
  NewDeliveryAddress,
  NewDeliveryForm,
  NewDeliveryPrice,
  TaskHome,
  TaskComplete,
  TaskPhoto,
  TaskSignature,
  StoreDashboard,
  StoreDelivery,
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
