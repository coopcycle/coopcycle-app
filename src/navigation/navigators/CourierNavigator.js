import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import i18n from '../../i18n'
import TrackingIcon from '../../components/TrackingIcon'
import screens, { defaultNavigationOptions, headerLeft } from '..'
import TaskNavigator from './TaskNavigator'

const Tabs = createCompatNavigatorFactory(createBottomTabNavigator)({
  CourierTasks: {
    screen: screens.CourierTasksPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS'),
      tabBarTestID: 'messengerTabMap',
      tabBarIcon: ({ color }) => {
        return (
          <Icon type="FontAwesome" name="map" style={{ color }} />
        )
      },
    }),
  },
  CourierTaskList: {
    screen: screens.CourierTaskListPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASK_LIST'),
      tabBarTestID: 'messengerTabList',
      tabBarIcon: ({ color }) => {
        return (
          <Icon type="FontAwesome" name="list" style={{ color }} />
        )
      },
    }),
  },
}, {
  tabBarOptions: {
    showLabel: false,
  },
})

const styles = StyleSheet.create({
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 10,
  },
})

const ButtonWithIcon = ({ name, onPress }) => {

  return (
    <TouchableOpacity onPress={ onPress } style={ styles.button }>
      <Icon name={ name } style={{ color: 'white' }} />
    </TouchableOpacity>
  )
}

const MainNavigator = createCompatNavigatorFactory(createStackNavigator)({
  CourierHome: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: headerLeft(navigation, 'menuBtnCourier'),
      headerRight: () =>
        <View style={ styles.buttonBar }>
          <ButtonWithIcon name="settings" onPress={ () => navigation.navigate('CourierSettings') } />
          <TouchableOpacity style={ styles.button }>
            <TrackingIcon />
          </TouchableOpacity>
        </View>
      ,
    }),
  },
  Task: {
    screen: TaskNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
}, {
  initialRouteKey: 'CourierHome',
  initialRouteName: 'CourierHome',
  defaultNavigationOptions,
})

const SettingsStack = createCompatNavigatorFactory(createStackNavigator)({
  CourierSettings: {
    screen: screens.CourierSettings,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
  CourierSettingsTags: {
    screen: screens.CourierSettingsTags,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
}, {
  defaultNavigationOptions,
})

export default createCompatNavigatorFactory(createStackNavigator)({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
  CourierSettings: {
    screen: SettingsStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
})
