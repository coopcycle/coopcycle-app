import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import React from 'react';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { stackNavigatorScreenOptions } from '../styles';
import HeaderBackButton from '../store/components/HeaderBackButton';
import HeaderButton from '../../components/HeaderButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';

const MainStack = createStackNavigator();

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={stackNavigatorScreenOptions}>
      <MainStack.Screen
        name="StoreDashboard"
        component={screens.StoreDashboard}
        options={({ navigation, route }) => {
          const store = route.params?.store;
          const title = store ? store.name : '';
          const navigateToDelivery = () => {
            navigation.navigate(
              'NewDelivery',
              {
                screen: 'NewDeliveryPickup',
              }
            )
          }

          return {
            title,
            headerLeft: headerLeft(navigation),
            headerRight: () => (
              <HeaderButton
                iconType="FontAwesome"
                iconName="plus"
                onPress={navigateToDelivery}
                testID="navigate_to_delivery"
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
}

const RootStack = createStackNavigator();

export default ({navigation}) => {
  const dispatch = useDispatch();

  const deliveryCallback = (newDelivery) => {
    navigation.navigate("StoreHome");
    dispatch(createDeliverySuccess(newDelivery));
  }

  return (
    <DeliveryCallbackProvider callback={deliveryCallback}>
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
    </DeliveryCallbackProvider>
  )
};
