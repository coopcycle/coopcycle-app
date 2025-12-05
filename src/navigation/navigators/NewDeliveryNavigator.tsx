import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import screens from '..';
import { useStackNavigatorScreenOptions } from '../styles';

const NewDeliveryStack = createNativeStackNavigator();

export const NewDeliveryNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions({
    detachInactiveScreens: false,
  });

  return (
    <NewDeliveryStack.Navigator screenOptions={screenOptions}>
      <NewDeliveryStack.Screen
        name="NewDeliveryStore"
        component={screens.NewDeliveryStore}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <NewDeliveryStack.Screen
        name="NewDeliveryPickupAddress"
        component={screens.NewDeliveryPickupAddress}
        options={{
          headerShown: false,
        }}
      />
      <NewDeliveryStack.Screen
        name="NewDeliveryDropoffAddress"
        component={screens.NewDeliveryDropoffAddress}
        options={{
          headerShown: false,
        }}
      />
      <NewDeliveryStack.Screen
        name="NewDeliveryDropoffDetails"
        component={screens.NewDeliveryDropoffDetails}
        options={{
          headerShown: false,
        }}
      />
      <NewDeliveryStack.Screen
        name="NewDeliveryPrice"
        component={screens.NewDeliveryPrice}
        options={{
          headerShown: false,
        }}
      />
    </NewDeliveryStack.Navigator>
  );
};
