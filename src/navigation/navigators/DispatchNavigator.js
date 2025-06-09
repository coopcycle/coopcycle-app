import { Box, Icon, Input } from 'native-base';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React from 'react';

import { createDeliverySuccess } from '../../redux/Store/actions';
import { DeliveryCallbackProvider } from '../delivery/contexts/DeliveryCallbackContext';
import { NewDeliveryNavigator } from './NewDeliveryNavigator';
import { useDispatch } from 'react-redux';
import { useStackNavigatorScreenOptions } from '../styles';
import HeaderRightButton from '../dispatch/HeaderRightButton';
import i18n from '../../i18n';
import NavigationHolder from '../../NavigationHolder';
import screens, { headerLeft } from '..';
import TaskNavigator from './TaskNavigator';


const Tab = createBottomTabNavigator();

function CutomBottomTabNavigator({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', marginBottom: 14, paddingHorizontal: 24, gap: 14 }}>
      <TouchableOpacity onPress={navigation.navigate('DispatchTasksMap')}>
        <Icon as={FontAwesome} name="map" />
      </TouchableOpacity>
      <Box style= {{ flex: 1, overflow: 'hidden' }}>
        <Input placeholder="Search" />
      </Box>
      <Box onPress={navigation.navigate('DispatchAllTasks')}>
        <Icon as={FontAwesome} name="filter"/>
      </Box>
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
        name="DispatchAllTasks"
        component={screens.DispatchAllTasks}
        options={({ navigation }) => ({
          title: false,
          tabBarTestID: 'dispatchAllTasks',
        })}
      />
      <Tab.Screen
        name="DispatchTasksMap"
        component={screens.DispatchTasksMap}
        options={({ navigation }) => ({
          title: false,
          tabBarTestID: 'dispatchTasksMap',
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
      {/* <MainStack.Screen
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
      /> */}
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
