import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens from '..';
import { stackNavigatorScreenOptions } from '../styles';


const NewDeliveryStack = createStackNavigator();

const newDeliveryNavigatorScreenOptions = {
  ...stackNavigatorScreenOptions,
    detachInactiveScreens: false,
}

export const NewDeliveryNavigator = () => (
  <NewDeliveryStack.Navigator screenOptions={newDeliveryNavigatorScreenOptions}>
    <NewDeliveryStack.Screen
      name="NewDeliveryPickup"
      component={screens.NewDeliveryPickup}
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