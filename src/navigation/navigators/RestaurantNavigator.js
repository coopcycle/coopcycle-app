import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import i18n from '../../i18n';
import screens, { headerLeft } from '..';
import { stackNavigatorScreenOptions } from '../styles';
import HeaderRight from '../restaurant/components/HeaderRight';
import SettingsNavigator from '../restaurant/SettingsNavigator';
import OrderNumber from '../../components/OrderNumber';

const MainStack = createStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <MainStack.Screen
      name="RestaurantHome"
      component={screens.RestaurantDashboard}
      options={({ navigation, route }) => {
        const restaurant = route.params?.restaurant || { name: '' };

        return {
          title: restaurant.name,
          headerRight: () => <HeaderRight navigation={navigation} />,
          headerLeft: headerLeft(navigation),
        };
      }}
    />
    <MainStack.Screen
      name="RestaurantOrder"
      component={screens.RestaurantOrder}
      options={({ route }) => ({
        headerTitle: () => <OrderNumber order={route.params?.order} />,
      })}
    />
  </MainStack.Navigator>
);

const RootStack = createStackNavigator();

export default () => (
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
      name="RestaurantOrderRefuse"
      component={screens.RestaurantOrderRefuse}
      options={{
        title: 'Refuse order', // TODO Translate
      }}
    />
    <RootStack.Screen
      name="RestaurantOrderDelay"
      component={screens.RestaurantOrderDelay}
      options={{
        title: i18n.t('RESTAURANT_ORDER_DELAY_MODAL_TITLE'),
      }}
    />
    <RootStack.Screen
      name="RestaurantOrderCancel"
      component={screens.RestaurantOrderCancel}
      options={{
        title: i18n.t('RESTAURANT_ORDER_CANCEL_MODAL_TITLE'),
      }}
    />
    <RootStack.Screen
      name="RestaurantDate"
      component={screens.RestaurantDate}
      options={{
        title: 'Choose date', // TODO Translate
      }}
    />
    <RootStack.Screen
      name="RestaurantList"
      component={screens.RestaurantList}
      options={{
        title: i18n.t('RESTAURANTS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantSettings"
      component={SettingsNavigator}
      options={{
        headerShown: false,
        title: i18n.t('SETTINGS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantLoopeatFormats"
      component={screens.RestaurantLoopeatFormats}
      options={{
        title: i18n.t('RESTAURANT_LOOPEAT_UPDATE_FORMATS'),
      }}
    />
  </RootStack.Navigator>
);
