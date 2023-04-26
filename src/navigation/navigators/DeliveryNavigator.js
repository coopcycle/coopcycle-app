import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'native-base';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import i18n from '../../i18n';
import { primaryColor } from '../../styles/common';
import screens, { headerLeft } from '../index';
import { stackNavigatorScreenOptions } from '../styles';
import AccountNavigator from './AccountNavigator';

function getNestedOptions(navigation, route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Home':
      return {};
    case 'Delivery':
      return {};
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
      }}
    >
      <Tab.Screen name="Home" options={{
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="home" size={size} color={color}/>,
      }} component={screens.Delivery}/>
      <Tab.Screen name="Account" options={{
        tabBarIcon: ({ color, size }) => <Icon as={FontAwesome5} name="user-alt" size={size} color={color}/>,
        title: i18n.t('MY_ACCOUNT'),
      }} component={AccountNavigator}/>
    </Tab.Navigator>
  );
}

const MainStack = createStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={stackNavigatorScreenOptions}>
    <MainStack.Screen
      name="CheckoutHome"
      component={Tabs}
      options={({ navigation, route }) => ({
        title: i18n.t('DELIVERIES'),
        headerLeft: headerLeft(navigation),
        ...getNestedOptions(navigation, route),
      })}
    />
  </MainStack.Navigator>
)

const RootStack = createStackNavigator()

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
  </RootStack.Navigator>
)

const DeliveryNav = () => {
  return <DefaultNav />
}

export default DeliveryNav
