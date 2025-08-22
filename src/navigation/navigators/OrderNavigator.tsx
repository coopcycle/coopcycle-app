import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useStackNavigatorScreenOptions } from '../styles';
import OrderTitle from '../../components/OrderTitle';
import screens from '..';

const RootStack = createStackNavigator();

export default () => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });

  return (
    <RootStack.Navigator screenOptions={screenOptions}>
      <RootStack.Screen
        name="Order"
        component={screens.Order}
        options={({ route }) => ({
          title: <OrderTitle order={route.params?.orderId} />,
          headerShown: true,
        })}
      />
    </RootStack.Navigator>
  );
};
