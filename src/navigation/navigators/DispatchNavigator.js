import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Box, Icon, Input, Text } from 'native-base';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import screens, { headerLeft } from '..';
import i18n from '../../i18n';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import { useStackNavigatorScreenOptions } from '../styles';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import TaskNavigator from './TaskNavigator';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { useDispatch } from 'react-redux';
import { createDeliverySuccess } from '../../redux/Store/actions';
import NavigationHolder from '../../NavigationHolder';
import { HeaderBackButton } from '@react-navigation/elements';
import { View } from 'react-native';


const Tab = createBottomTabNavigator();

function CutomBottomTabNavigator({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginBottom: 14, paddingHorizontal: 24, gap: 14 }}>
      <Box><Icon as={FontAwesome} name="map" /></Box>
        <Box style= {{ flex: 1, overflow: 'hidden' }}>
            <Input placeholder="Search" />
          </Box>
          <Box><Icon as={FontAwesome} name="filter" onPress={navigation.navigate('DispatchAllTasks')} /></Box>
    </View>
  );
}

const Tabs = () => (
  <Tab.Navigator
      tabBar={(props) => <CutomBottomTabNavigator {...props}/>}
      screenOptions={{
      headerShown: false,
      tabBarShowIcon: true,
    }}>
       <Tab.Screen
      name="DispatchTaskLists"
      component={screens.DispatchAllTasks}
      options={({ navigation }) => ({
        title: false,
        tabBarTestID: 'dispatchAllTasks',
      })}
    />
  </Tab.Navigator>
);

const MainStack = createStackNavigator();

const MainNavigator = () => {
  const screenOptions = useStackNavigatorScreenOptions();

  return (
    <MainStack.Navigator screenOptions={screenOptions}>
    <MainStack.Screen
      name="DispatchHome"
      component={Tabs}
      options={({ navigation }) => ({
        title: i18n.t('DISPATCH'),
        headerLeft: headerLeft(navigation, 'menuBtnDispatch'),
        headerRight: () => (
          <HeaderRightButton
            onPress={() => navigation.navigate('DispatchDate')}
          />
        ),
      })}
    />
      <MainStack.Screen
        name="DispatchAllTasks"
        component={screens.DispatchAllTasks}
        options={({ navigation }) => ({
          title: i18n.t('DISPATCH'),
          headerLeft: headerLeft(navigation, 'menuBtnDispatch'),
          headerRight: () => (
            <HeaderRightButton
              onPress={() => navigation.navigate('DispatchDate')}
            />
          ),
        })}
      />
      <MainStack.Screen
        name="Task"
        component={TaskNavigator}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};

const RootStack = createStackNavigator();

export default ({ navigation }) => {
  const screenOptions = useStackNavigatorScreenOptions({
    presentation: 'modal',
  });
  const dispatch = useDispatch();

  const deliveryCallback = newDelivery => {
    navigation.navigate('DispatchAllTasks');
    dispatch(createDeliverySuccess(newDelivery));
  };
  return (
    <DeliveryCallbackProvider callback={deliveryCallback}>
      <RootStack.Navigator screenOptions={screenOptions}>
        <RootStack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="DispatchPickUser"
          component={screens.DispatchPickUser}
          options={{
            title: i18n.t('DISPATCH_PICK_USER'),
          }}
        />
        <RootStack.Screen
          name="DispatchNewDelivery"
          component={NewDeliveryNavigator}
          options={{
            title: i18n.t('DISPATCH_NEW_DELIVERY'),
            headerBackTitleVisible: false,
            headerLeft: props => (
              <HeaderBackButton
                {...props}
                onPress={() => NavigationHolder.goBack()}
              />
            ),
          }}
        />
        <RootStack.Screen
          name="DispatchDate"
          component={screens.DispatchDate}
          options={{
            title: i18n.t('DISPATCH_DATE'),
          }}
        />
      </RootStack.Navigator>
    </DeliveryCallbackProvider>
  );
};
