import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { Icon, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect, useSelector } from 'react-redux';
import screens, { headerLeft } from '..';
import i18n from '../../i18n';
import {
  selectIsAuthenticated,
  selectIsGuest,
} from '../../redux/App/selectors';
import store from '../../redux/store';
import { primaryColor } from '../../styles/common';
import CartsBadge from '../checkout/components/CartsBadge';
import AskAddress from '../home/AskAddress';
import { stackNavigatorScreenOptions } from '../styles';
import AccountNavigator from './AccountNavigator';

function getNestedOptions(navigation, route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Home':
      return {};
    case 'Search':
      return {};
    case 'Cart':
      return {
        title: i18n.t('CART'),
        headerRight: () => {
          if (selectIsAuthenticated(store.getState())) {
            return (
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={() => {
                  navigation.navigate('AccountOrders');
                }}>
                <Text style={{ color: 'white' }}>{i18n.t('MY_ORDERS')}</Text>
              </TouchableOpacity>
            );
          }
        },
      };
    case 'Account':
      return {
        headerShown: false,
      };
    default:
      return {};
  }
}

const Tab = createBottomTabNavigator();

function Tabs({ rootNavigation: navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        ...stackNavigatorScreenOptions,
        headerShown: false,
        tabBarActiveTintColor: primaryColor,
      }}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={FontAwesome5} name="home" size={size} color={color} />
          ),
        }}
        component={screens.RestaurantsPage}
      />
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={FontAwesome5} name="search" size={size} color={color} />
          ),
          title: i18n.t('SEARCH_TAB'),
        }}
        component={screens.SearchForm}
      />
      <Tab.Screen
        name="Cart"
        options={{
          tabBarBadge: <CartsBadge />,
          tabBarIcon: ({ color, size }) => (
            <Icon
              as={FontAwesome5}
              name="shopping-cart"
              size={size}
              color={color}
            />
          ),
          title: i18n.t('CART'),
        }}
        component={screens.Carts}
      />
      <Tab.Screen
        name="Account"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={FontAwesome5} name="user-alt" size={size} color={color} />
          ),
          title: i18n.t('MY_ACCOUNT'),
        }}
        component={AccountNavigator}
      />
    </Tab.Navigator>
  );
}

const MainStack = createStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <MainStack.Screen
      name="CheckoutHome"
      component={Tabs}
      options={({ navigation, route }) => ({
        title: i18n.t('RESTAURANTS'),
        headerLeft: headerLeft(navigation),
        ...getNestedOptions(navigation, route),
      })}
    />
    <MainStack.Screen
      name="CheckoutRestaurant"
      component={screens.CheckoutRestaurant}
      options={({
        route: {
          params: { restaurant },
        },
      }) => ({
        title: restaurant.name,
      })}
    />
    <MainStack.Screen
      name="CheckoutSummary"
      component={screens.CheckoutSummary}
      options={({ navigation, route }) => ({
        title: i18n.t('CART'),
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingHorizontal: 10 }}
            onPress={() => {
              navigation.setParams({ edit: !(route.params?.edit || false) });
            }}>
            <Text>
              {route.params?.edit || false
                ? i18n.t('FINISHED')
                : i18n.t('EDIT')}
            </Text>
          </TouchableOpacity>
        ),
      })}
    />
    <MainStack.Screen
      name="CheckoutCreditCard"
      component={screens.CheckoutCreditCard}
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
    <MainStack.Screen
      name="CheckoutMercadopago"
      component={screens.CheckoutMercadopago}
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
    <MainStack.Screen
      name="AccountOrders"
      component={screens.AccountOrdersPage}
      options={{
        title: i18n.t('MY_ORDERS'),
        ...TransitionPresets.ModalTransition,
      }}
    />
    {/*FIXME: AccountAddresses and AddressDetails also exist in AccountNavigator, get rid from this duplication */}
    <MainStack.Screen
      name="AccountAddresses"
      component={screens.AccountAddressesPage}
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <MainStack.Screen
      name="AddressDetails"
      component={screens.AddressDetails}
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />

    <MainStack.Screen
      name="AccountOrdersList"
      component={screens.AccountOrdersPage}
      options={{
        title: i18n.t('MY_ORDERS'),
      }}
    />
    <MainStack.Screen
      name="AccountOrder"
      component={screens.AccountOrderPage}
      options={({ route }) => ({
        title: route.params.order
          ? i18n.t('ORDER_NUMBER', { number: route.params.order.number })
          : i18n.t('MY_ORDER'),
        ...TransitionPresets.ModalTransition,
      })}
    />

    <MainStack.Screen
      name="OrderTracking"
      component={screens.OrderTrackingPage}
      options={({ route }) => ({
        title: route.params.order
          ? i18n.t('ORDER_NUMBER', { number: route.params.order.number })
          : i18n.t('MY_ORDER'),
      })}
    />
  </MainStack.Navigator>
);

const SubmitOrderStack = createStackNavigator();

const SubmitOrderNavigator = () => {
  const isAuthenticatedUser = useSelector(selectIsAuthenticated);
  const isGuest = useSelector(selectIsGuest);

  return (
    <SubmitOrderStack.Navigator screenOptions={stackNavigatorScreenOptions}>
      {isAuthenticatedUser || isGuest ? (
        <SubmitOrderStack.Screen
          name="CheckoutMoreInfos"
          component={screens.CheckoutMoreInfos}
          options={{
            title: i18n.t('CHECKOUT_MORE_INFOS'),
          }}
        />
      ) : (
        <SubmitOrderStack.Group
          screenOptions={{
            title: i18n.t('CHECKOUT_LOGIN_TITLE'),
          }}>
          <SubmitOrderStack.Screen
            name="CheckoutLoginRegister"
            component={screens.CheckoutLogin}
          />
          <SubmitOrderStack.Screen
            name="CheckoutCheckEmail"
            component={screens.AccountRegisterCheckEmail}
          />
          <SubmitOrderStack.Screen
            name="CheckoutForgotPassword"
            component={screens.AccountForgotPassword}
          />
          <SubmitOrderStack.Screen
            name="CheckoutResetPasswordCheckEmail"
            component={screens.AccountResetPasswordCheckEmail}
          />
        </SubmitOrderStack.Group>
      )}
    </SubmitOrderStack.Navigator>
  );
};
const RootStack = createStackNavigator();

const DefaultNav = () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="Main"
      component={MainNavigator}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="CheckoutProductDetails"
      component={screens.CheckoutProductDetails}
      options={({ _, route }) => {
        const productName = route.params?.product.name || '';
        return {
          title: productName,
        };
      }}
    />
    <RootStack.Screen
      name="CheckoutShippingDate"
      component={screens.CheckoutShippingDate}
      options={{
        title: i18n.t('CHECKOUT_SHIPPING_DATE'),
      }}
    />
    <RootStack.Screen
      name="CheckoutSubmitOrder"
      component={SubmitOrderNavigator}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCard"
      component={screens.CheckoutPaymentMethodCard}
      options={{
        title: i18n.t('PAYMENT_METHOD.card'),
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCashOnDelivery"
      component={screens.CheckoutPaymentMethodCashOnDelivery}
      options={{
        title: i18n.t('PAYMENT_METHOD.cash_on_delivery'),
      }}
    />
    <RootStack.Screen
      name="CheckoutLoopeat"
      component={screens.CheckoutLoopeat}
      options={{
        title: i18n.t('ZERO_WASTE'),
      }}
    />
  </RootStack.Navigator>
);

const CheckoutNav = ({ address }) => {
  if (!address) {
    return (
      <RootStack.Navigator
        screenOptions={{
          ...stackNavigatorScreenOptions,
          presentation: 'modal',
        }}
        initialRouteName="CheckoutAskAddress">
        <RootStack.Screen
          name="CheckoutAskAddress"
          component={AskAddress}
          options={({ navigation }) => ({
            title: i18n.t('WHERE_ARE_YOU'),
            headerLeft: headerLeft(navigation),
          })}
        />
      </RootStack.Navigator>
    );
  }

  return <DefaultNav />;
};

function mapStateToProps(state) {
  return {
    address: state.checkout.address,
  };
}

export default connect(mapStateToProps)(CheckoutNav);
