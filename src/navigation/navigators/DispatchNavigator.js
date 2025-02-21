import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'native-base';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import screens, { headerLeft } from '..';
import i18n from '../../i18n';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import { stackNavigatorScreenOptions } from '../styles';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import TaskNavigator from './TaskNavigator';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { useDispatch } from 'react-redux';
import { createDeliverySuccess } from '../../redux/Store/actions';
import NavigationHolder from '../../NavigationHolder';
import { HeaderBackButton } from '@react-navigation/elements';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowIcon: true,
    }}>
    <Tab.Screen
      name="DispatchUnassignedTasks"
      component={screens.DispatchUnassignedTasks}
      options={({ navigation }) => ({
        title: i18n.t('DISPATCH_UNASSIGNED_TASKS'),
        tabBarTestID: 'dispatch:unassignedTab',
        tabBarIcon: ({ focused, horizontal, color }) => {
          return <Icon as={FontAwesome} name="clock-o" style={{ color }} />;
        },
      })}
    />
    <Tab.Screen
      name="DispatchTaskLists"
      component={screens.DispatchTaskLists}
      options={({ navigation }) => ({
        title: i18n.t('DISPATCH_TASK_LISTS'),
        tabBarTestID: 'dispatch:assignedTab',
        tabBarIcon: ({ focused, horizontal, color }) => {
          return <Icon as={FontAwesome} name="user" style={{ color }} />;
        },
      })}
    />
  </Tab.Navigator>
);

const MainStack = createStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator screenOptions={stackNavigatorScreenOptions}>
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
      name="DispatchTaskList"
      component={screens.DispatchTaskList}
      options={({ route }) => ({
        title: i18n.t('DISPATCH_TASK_LIST', {
          username: route.params?.taskList.username,
        }),
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


const RootStack = createStackNavigator();

export default ({navigation}) => {
  const dispatch = useDispatch()

  const deliveryCallback = (newDelivery) => {
    navigation.navigate("DispatchHome");
     dispatch(createDeliverySuccess(newDelivery));
  }
  return (
  <DeliveryCallbackProvider callback={deliveryCallback}>
    <RootStack.Navigator
      screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
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
      <RootStack.Screen
        name="DispatchAssignTask"
        component={screens.DispatchAssignTask}
        options={{
          title: i18n.t('DISPATCH_ASSIGN_TASK'),
        }}
      />
    </RootStack.Navigator>
  </DeliveryCallbackProvider>
  )}
