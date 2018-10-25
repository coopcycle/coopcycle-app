import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon, Text } from 'native-base'
import { createStackNavigator } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'
import HeaderButton from '../../components/HeaderButton'

const MainNavigator = createStackNavigator({
  CourierHome: {
    screen: navigation.CourierPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: headerLeft(navigation)
    })
  },
  CourierTasks: {
    screen: navigation.CourierTasksPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS'),
    })
  },
  CourierTaskList: {
    screen: navigation.CourierTaskListPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASK_LIST'),
    })
  },
  CourierTask: {
    screen: navigation.CourierTaskPage,
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
  CourierSettings: {
    screen: navigation.CourierSettingsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    })
  },
}, {
  initialRouteKey: 'CourierHome',
  initialRouteName: 'CourierHome',
  navigationOptions: {
    ...defaultNavigationOptions
  }
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  CourierTaskComplete: {
    screen: navigation.CourierTaskComplete,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    })
  },
  CourierFilters: {
    screen: navigation.CourierFilters,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS_FILTER')
    })
  },
}, {
  mode: 'modal',
  navigationOptions: ({ navigation }) => ({
    ...defaultNavigationOptions
  })
})
