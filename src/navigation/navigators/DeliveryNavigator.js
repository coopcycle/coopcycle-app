import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import i18n from '../../i18n';
import screens, { headerLeft } from '../index';
import { useStackNavigatorScreenOptions } from '../styles';

const MainStack = createStackNavigator();

const MainNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="DeliveryFormHome"
        component={screens.Delivery}
        options={({ navigation, route }) => ({
          title: i18n.t('DELIVERIES'),
          headerLeft: headerLeft(navigation),
        })}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
