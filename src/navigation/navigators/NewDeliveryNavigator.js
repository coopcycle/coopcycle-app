import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import screens from '..';
import { stackNavigatorScreenOptions } from '../styles';


const NewDeliveryStack = createStackNavigator();

export const NewDeliveryNavigator = () => (
  <NewDeliveryStack.Navigator screenOptions={stackNavigatorScreenOptions}>
    <NewDeliveryStack.Screen
      name="NewDeliveryStore"
      component={screens.NewDeliveryStore}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="NewDeliveryPickup"
      component={screens.NewDeliveryPickup}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="NewDeliveryAddress"
      component={screens.NewDeliveryAddress}
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="NewDeliveryForm"
      component={screens.NewDeliveryForm}
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