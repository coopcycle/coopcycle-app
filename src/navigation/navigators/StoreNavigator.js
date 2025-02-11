import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { stackNavigatorScreenOptions } from '../styles';
import HeaderBackButton from '../store/components/HeaderBackButton';
import HeaderButton from '../../components/HeaderButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';

const MainStack = createStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <MainStack.Screen
      name="StoreDashboard"
      component={screens.StoreDashboard}
      options={({ navigation, route }) => {
        const store = route.params?.store;
        const title = store ? store.name : '';

        return {
          title,
          headerLeft: headerLeft(navigation),
          headerRight: () => (
            <HeaderButton
              iconType="FontAwesome"
              iconName="plus"
              onPress={() => navigation.navigate('NewDelivery', { screen: 'NewDeliveryPickup' })}
            />
          ),
        };
      }}
    />
    <MainStack.Screen
      name="StoreDelivery"
      component={screens.StoreDelivery}
      options={({ route }) => {
        let id;
        if (route.params.delivery) {
          id = route.params.delivery.orderNumber
            ? route.params.delivery.orderNumber
            : route.params.delivery.id;
        }
        return {
          title: i18n.t('STORE_DELIVERY', { id: id }),
        };
      }}
    />
  </MainStack.Navigator>
);

const RootStack = createStackNavigator();

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions(), presentation: 'modal' }}>
    <RootStack.Screen
      name="StoreHome"
      component={MainNavigator}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="NewDelivery"
      component={NewDeliveryNavigator}
      options={{
        title: i18n.t('STORE_NEW_DELIVERY'),
        headerLeft: props => (
          <HeaderBackButton
            {...props}
            onPress={() => NavigationHolder.goBack()}
          />
        ),
      }}
    />
  </RootStack.Navigator>
);
