import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens from '..';
import { useStackNavigatorScreenOptions } from '../styles';

const NewDeliveryStack = createStackNavigator();

export const NewDeliveryNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    // `detachInactiveScreens` is a navigator prop, not a screen option; it used
    // to be passed through `screenOptions` here, where it had no effect.
    <NewDeliveryStack.Navigator
      detachInactiveScreens={false}
      screenOptions={screenOptions}>
      <NewDeliveryStack.Screen
        name="NewDeliveryStore"
        component={screens.NewDeliveryStore}
        options={{
          headerShown: false,
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
