import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { HeaderButtons, HeaderButton } from '../../components/HeaderButton';
import i18n from '../../i18n';
import { useStackNavigatorScreenOptions } from '../styles';

import ConfigureServer from '../ConfigureServer';
import ChooseCity from '../home/ChooseCity';
import CustomServer from '../home/CustomServer';

const MainStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

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
            <HeaderButtons>
              <HeaderButton
                testID="moreServerOptions"
                iconName="ellipsis-horizontal-sharp"
                onPress={() => navigation.navigate('HomeCustomServer')} />
            </HeaderButtons>
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
