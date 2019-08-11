import React, { Component } from 'react'
import { View } from 'react-native'
import { Button, Icon, Text } from 'native-base'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  HeaderBackButton } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'
import TaskNavigator from './TaskNavigator'

const Tabs = createBottomTabNavigator({
  CourierTasks: {
    screen: navigation.CourierTasksPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon type="FontAwesome" name="map" style={{ color: tintColor }} />
        )
      },
    })
  },
  CourierTaskList: {
    screen: navigation.CourierTaskListPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASK_LIST'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon type="FontAwesome" name="list" style={{ color: tintColor }} />
        )
      }
    })
  },
}, {
  tabBarOptions: {
    showLabel: false
  }
})

const MainNavigator = createStackNavigator({
  CourierHome: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: headerLeft(navigation),
      headerRight: (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button transparent onPress={() => navigation.navigate('CourierSettings')}>
            <Icon name="settings" style={{ color: 'white' }} />
          </Button>
          <Button transparent>
            <Icon name="navigate" style={{ color: navigation.getParam('tracking', false) ? 'green' : 'lightgrey' }}/>
          </Button>
        </View>
      )
    })
  },
  Task: {
    screen: TaskNavigator,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    })
  },
  CourierTaskHistory: {
    screen: navigation.CourierTaskHistoryPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('HISTORY'),
    })
  },
}, {
  initialRouteKey: 'CourierHome',
  initialRouteName: 'CourierHome',
  defaultNavigationOptions,
})

const SettingsStack = createStackNavigator({
  CourierSettings: {
    screen: navigation.CourierSettings,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  CourierSettingsTags: {
    screen: navigation.CourierSettingsTags,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
}, {
  defaultNavigationOptions
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  CourierSettings: {
    screen: SettingsStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS')
    })
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
})
