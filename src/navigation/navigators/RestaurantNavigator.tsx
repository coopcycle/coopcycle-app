import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import React from 'react';
import { useTranslation } from 'react-i18next';

import screens, { headerLeft } from '..';
import OrderNumber from '../../components/OrderNumber';
import i18n from '../../i18n';
import SettingsNavigator from '../restaurant/SettingsNavigator';
import HeaderRight from '../restaurant/components/HeaderRight';
import { selectRestaurant } from '../../redux/Restaurant/selectors';
import { useStackNavigatorScreenOptions } from '../styles';

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {

  const { t } = useTranslation();
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="RestaurantHome"
        component={screens.RestaurantDashboard}
        options={({ navigation, route }) => {

          const restaurant = useSelector(selectRestaurant)

          return {
            title: restaurant?.name || t('RESTAURANT'),
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
};

const RootStack = createNativeStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
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
      <RootStack.Screen
        name="RestaurantSearch"
        component={screens.RestaurantSearch}
        options={{
          title: i18n.t('RESTAURANT_SEARCH_ORDERS'),
        }}
      />
    </RootStack.Navigator>
  );
};
