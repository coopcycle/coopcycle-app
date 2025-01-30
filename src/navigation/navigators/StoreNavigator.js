import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens, { headerLeft } from '..';
import NavigationHolder from '../../NavigationHolder';
import HeaderButton from '../../components/HeaderButton';
import i18n from '../../i18n';
import HeaderBackButton from '../store/components/HeaderBackButton';
import { stackNavigatorScreenOptions } from '../styles';

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
              onPress={() => navigation.navigate('StoreNewDelivery')}
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

const NewDeliveryStack = createStackNavigator();

const NewDeliveryNavigator = () => (
  <NewDeliveryStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryPickup"
      component={screens.StoreNewDeliveryPickup}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryAddress"
      component={screens.StoreNewDeliveryAddress}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryForm"
      component={screens.StoreNewDeliveryForm}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryPrice"
      component={screens.StoreNewDeliveryPrice}
      options={{
        headerShown: false,
      }}
    />
  </NewDeliveryStack.Navigator>
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
      name="StoreNewDelivery"
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
