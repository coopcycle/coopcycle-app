import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions, CommonActions } from '@react-navigation/native';
import { HeaderButton as RNHeaderButton } from '@react-navigation/elements';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { selectStore } from '../../redux/Store/selectors';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { useStackNavigatorScreenOptions } from '../styles';
import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import { useTranslation } from 'react-i18next';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';

const RootStack = createNativeStackNavigator();

export default ({ navigation }) => {

  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  const { t } = useTranslation();

  const width = Dimensions.get('window').width;

  const dispatch = useDispatch();
  const store = useSelector(selectStore);

  const deliveryCallback = newDelivery => {

    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'StoreDashboard',
        },
      ],
    }));

    dispatch(createDeliverySuccess(newDelivery));
  };
  const deliveryCallbackOptions = {
    allowManualPrice: false,
  };

  return (
    <DeliveryCallbackProvider callback={deliveryCallback} options={deliveryCallbackOptions}>
      <RootStack.Navigator
        screenOptions={useStackNavigatorScreenOptions()}
      >
        <RootStack.Group>
          <RootStack.Screen
            name="StoreDashboard"
            component={screens.StoreDashboard}
            options={({ navigation }) => {

              const navigateToDelivery = () => {
                navigation.navigate('NewDelivery', {
                  screen: 'NewDeliveryPickupAddress',
                });
              };

              return {
                title: store?.name || '',
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
          <RootStack.Screen
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
                title: t('STORE_DELIVERY', { id: id }),
              };
            }}
          />
        </RootStack.Group>
        <RootStack.Group
          screenOptions={ useStackNavigatorScreenOptions({
            presentation: 'modal',
            headerTitle: t('STORE_NEW_DELIVERY'),
            headerLeft: props => (
              <RNHeaderButton
                {...props}
                onPress={() => navigation.dispatch(StackActions.popToTop())}
              >
                <Text>{ t('CANCEL') }</Text>
              </RNHeaderButton>
            )
          }) }>
          <RootStack.Screen
            name="NewDelivery"
            component={NewDeliveryNavigator}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    </DeliveryCallbackProvider>
  );
};
