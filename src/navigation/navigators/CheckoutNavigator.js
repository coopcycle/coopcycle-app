import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon, Text } from 'native-base'
import { connect } from 'react-redux'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AskAddress from '../home/AskAddress';
import i18n from '../../i18n'
import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { primaryColor } from '../../styles/common';
import store from '../../redux/store'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { selectIsAuthenticated } from '../../redux/App/selectors';
import CartsBadge from '../checkout/components/CartsBadge';
import Config from 'react-native-config';

const OrderStack = createStackNavigator()

const OrderNavigator = () => (
  <OrderStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <OrderStack.Screen
      name="AccountOrdersList"
      component={ screens.AccountOrdersPage }
      options={{
        title: i18n.t('MY_ORDERS'),
      }}
    />
    <OrderStack.Screen
      name="AccountOrder"
      component={ screens.AccountOrderPage }
      options={ ({ route }) => ({
        title: route.params.order ? i18n.t('ORDER_NUMBER', { number: route.params.order.number }) : i18n.t('MY_ORDER'),
      })}
    />
  </OrderStack.Navigator>
)

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
            <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => { navigation.navigate('AccountOrders') }}>
              <Text style={{ color: 'white' }}>
                {i18n.t('MY_ORDERS')}
              </Text>
            </TouchableOpacity>)
          }
        },
      };
    case 'Account':
      return {};
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
      }}
    >
      <Tab.Screen name="Home" options={{
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="home" size={size} color={color} />,
      }} component={screens.RestaurantsPage} />
      { Config.CHECKOUT_SEARCH_ENABLED === '1' &&
      <Tab.Screen name="Search" options={{
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="search" size={size} color={color} />,
      }} component={screens.SearchForm} /> }
      <Tab.Screen name="Cart" options={{
        tabBarBadge: <CartsBadge/>,
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="shopping-cart" size={size} color={color} />,
        title: i18n.t('CART'),
      }} component={screens.Carts} />
      <Tab.Screen name="Account" options={{
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="user-alt" size={size} color={color} />,
      }} component={screens.AccountHome} />
    </Tab.Navigator>
  );
}

const MainStack = createStackNavigator()

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="CheckoutHome"
      component={ Tabs }
      options={ ({ navigation, route }) => ({
        title: i18n.t('RESTAURANTS'),
        headerLeft: headerLeft(navigation),
        ...getNestedOptions(navigation, route),
      })}
    />
    <MainStack.Screen
      name="CheckoutRestaurant"
      component={ screens.CheckoutRestaurant }
      options={{
        title: i18n.t('RESTAURANT'),
      }}
    />
    <MainStack.Screen
      name="CheckoutSummary"
      component={ screens.CheckoutSummary }
      options={ ({ navigation, route }) => ({
        title: i18n.t('CART'),
        headerRight: () => (
          <TouchableOpacity style={{ paddingHorizontal: 10 }}
            onPress={ () => {
              navigation.setParams({ edit: !(route.params?.edit || false) })
            }}>
            <Text style={{ color: 'white' }}>
              { (route.params?.edit || false) ? i18n.t('FINISHED') : i18n.t('EDIT') }
            </Text>
          </TouchableOpacity>
        ),
      })}
    />
    <MainStack.Screen
      name="CheckoutCreditCard"
      component={ screens.CheckoutCreditCard }
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
    <MainStack.Screen
      name="CheckoutMercadopago"
      component={ screens.CheckoutMercadopago }
      options={{
        title: i18n.t('PAYMENT'),
      }}
    />
    <MainStack.Screen name="SearchResults"
      component={screens.SearchResults}
      options={{
        title: i18n.t('SEARCH'),
        ...TransitionPresets.ModalTransition,
      }}/>

    <MainStack.Screen
      name="AccountAddresses"
      component={ screens.AccountAddressesPage }
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <MainStack.Screen
      name="AddressDetails"
      component={ screens.AddressDetails }
      options={{
        title: i18n.t('MY_ADDRESSES'),
      }}
    />
    <MainStack.Screen
      name="OrderTracking"
      component={ screens.OrderTrackingPage }
      options={ ({ route }) => ({
        title: route.params.order ? i18n.t('ORDER_NUMBER', { number: route.params.order.number }) : i18n.t('MY_ORDER'),
      })}
    />
    <MainStack.Screen
      name="AccountOrders"
      component={ OrderNavigator }
      options={{
        title: i18n.t('MY_ORDERS'),
        headerShown: false,
      }}
    />
  </MainStack.Navigator>
)

const LoginRegisterStack = createStackNavigator()

const LoginRegisterNavigator = () => (
  <LoginRegisterStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <LoginRegisterStack.Screen
      name="CheckoutLoginRegister"
      component={ screens.CheckoutLogin }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutCheckEmail"
      component={ screens.AccountRegisterCheckEmail }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutForgotPassword"
      component={ screens.AccountForgotPassword }
      options={{
        headerShown: false,
      }}
    />
    <LoginRegisterStack.Screen
      name="CheckoutResetPasswordCheckEmail"
      component={ screens.AccountResetPasswordCheckEmail }
      options={{
        headerShown: false,
      }}
    />
  </LoginRegisterStack.Navigator>
)

const RootStack = createStackNavigator()

const DefaultNav = () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="Main"
      component={ MainNavigator }
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="CheckoutProductDetails"
      component={ screens.CheckoutProductDetails }
      options={{
        title: '',
      }}
    />
    <RootStack.Screen
      name="CheckoutShippingDate"
      component={ screens.CheckoutShippingDate }
      options={{
        title: i18n.t('CHECKOUT_SHIPPING_DATE'),
      }}
    />
    <RootStack.Screen
      name="CheckoutLogin"
      component={ LoginRegisterNavigator }
      options={{
        title: i18n.t('CHECKOUT_LOGIN_TITLE'),
      }}
    />
    <RootStack.Screen
      name="CheckoutMoreInfos"
      component={ screens.CheckoutMoreInfos }
      options={{
        title: i18n.t('CHECKOUT_MORE_INFOS'),
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCard"
      component={ screens.CheckoutPaymentMethodCard }
      options={{
        title: i18n.t('PAYMENT_METHOD.card'),
      }}
    />
    <RootStack.Screen
      name="CheckoutPaymentMethodCashOnDelivery"
      component={ screens.CheckoutPaymentMethodCashOnDelivery }
      options={{
        title: i18n.t('PAYMENT_METHOD.cash_on_delivery'),
      }}
    />
  </RootStack.Navigator>
)

const CheckoutNav = ({ address }) => {

  if (!address) {

    const showHelp = (navigation, route) => () => {
      if (!route.params?.help) {
        return <></>
      }
      return <TouchableOpacity style={{ paddingHorizontal: 10 }}
                        onPress={ () => {
                          navigation.setParams({ help: !(route.params?.help || false) })
                        }}>
        <Text style={{ color: 'white' }}>{i18n.t('CLOSE')}</Text>
      </TouchableOpacity>
    }

    return (
      <RootStack.Navigator
        screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}
        initialRouteName="CheckoutAskAddress">
        <RootStack.Screen
          name="CheckoutAskAddress"
          component={ AskAddress }
          options={ ({ navigation, route }) => ({
            title: false,
            headerLeft: headerLeft(navigation),
            headerRight: showHelp(navigation, route),
          })}
        />
      </RootStack.Navigator>
    )
  }

  return <DefaultNav />
}

function mapStateToProps(state) {

  return {
    address: state.checkout.address,
  }
}

export default connect(mapStateToProps)(CheckoutNav)
