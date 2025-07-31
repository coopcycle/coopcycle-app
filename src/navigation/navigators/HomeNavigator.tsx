import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HeaderButton from '../../components/HeaderButton';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';

import ConfigureServer from '../ConfigureServer';
import ChooseCity from '../home/ChooseCity';
import CustomServer from '../home/CustomServer';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen
        name="Home"
        component={ConfigureServer}
        options={{
          title: 'CoopCycle',
          headerBackTitle: null,
        }}
      />
      <MainStack.Screen
        name="HomeChooseCity"
        component={ChooseCity}
        options={({ navigation }) => ({
          title: i18n.t('CHOOSE_CITY'),
          headerBackTitle: null,
          headerRight: () => (
            <HeaderButton
              testID="moreServerOptions"
              iconType="FontAwesome5"
              iconName="ellipsis-h"
              iconStyle={{ fontSize: 18 }}
              onPress={() => navigation.navigate('HomeCustomServer')}
            />
          ),
        })}
      />
    </MainStack.Navigator>
  );
};

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
          headerBackTitle: null,
        }}
      />
      <RootStack.Screen
        name="HomeCustomServer"
        component={CustomServer}
        options={{
          headerBackTitle: null,
          title: i18n.t('CUSTOM'),
        }}
      />
    </RootStack.Navigator>
  );
};
