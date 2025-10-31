import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import React from 'react';
import { Dimensions } from 'react-native';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderBackButton from '../store/components/HeaderBackButton';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';

const MainStack = createNativeStackNavigator();

function MainNavigator() {
  const screenOptions = useStackNavigatorScreenOptions();

  const width = Dimensions.get('window').width;

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="StoreDashboard"
        component={screens.StoreDashboard}
        options={({ navigation, route }) => {
          const store = route.params?.store;
          const title = store ? store.name : '';
          const navigateToDelivery = () => {
            navigation.navigate('NewDelivery', {
              screen: 'NewDeliveryPickupAddress',
            });
          };

          return {
            title,
            headerTitleStyle: {
              width: width - 160,
            },
            headerLeft: headerLeft(navigation),
            headerRight: () => (
              <HeaderButtons>
                <HeaderButton
                  iconName="add"
                  onPress={navigateToDelivery}
                  testID="navigate_to_delivery" />
              </HeaderButtons>
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

const RootStack = createNativeStackNavigator();

export default ({ navigation }) => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });
  const dispatch = useDispatch();

  const deliveryCallback = newDelivery => {
    navigation.navigate('StoreHome');
    dispatch(createDeliverySuccess(newDelivery));
  };

  return (
    <DeliveryCallbackProvider callback={deliveryCallback}>
      <RootStack.Navigator screenOptions={screenOptions}>
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
  );
};
