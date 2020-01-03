import React from 'react'
import { Icon} from 'native-base'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import i18n from '../../i18n'
import HeaderRightButton from '../dispatch/HeaderRightButton'
import TaskNavigator from './TaskNavigator'
import screens, { defaultNavigationOptions, headerLeft } from '..'

const Tabs = createBottomTabNavigator({
  DispatchUnassignedTasks: {
    screen: screens.DispatchUnassignedTasks,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_UNASSIGNED_TASKS'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon type="FontAwesome" name="clock-o" style={{ color: tintColor }} />
        )
      },
    }),
  },
  DispatchTaskLists: {
    screen: screens.DispatchTaskLists,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_TASK_LISTS'),
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return (
          <Icon type="FontAwesome" name="user" style={{ color: tintColor }} />
        )
      },
    }),
  },
}, {
  tabBarOptions: {
    showLabel: true,
    showIcon: true,
  },
})

const MainNavigator = createStackNavigator({
  DispatchHome: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH'),
      headerLeft: headerLeft(navigation),
      headerRight: (
        <HeaderRightButton onPress={ () => navigation.navigate('DispatchDate') } />
      ),
    }),
  },
  DispatchTaskList: {
    screen: screens.DispatchTaskList,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_TASK_LIST', { username: navigation.state.params.taskList.username }),
    }),
  },
  Task: {
    screen: TaskNavigator,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    }),
  },
}, {
  initialRouteKey: 'DispatchHome',
  initialRouteName: 'DispatchHome',
  defaultNavigationOptions,
})

const AddTaskNavigator = createStackNavigator({
  DispatchAddTaskHome: {
    screen: screens.DispatchAddTask,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
  DispatchEditAddress: {
    screen: screens.DispatchEditAddress,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
}, {
  initialRouteName: 'DispatchAddTaskHome',
  defaultNavigationOptions,
})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
  DispatchPickUser: {
    screen: screens.DispatchPickUser,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_PICK_USER'),
    }),
  },
  DispatchAddTask: {
    screen: AddTaskNavigator,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_ADD_TASK'),
    }),
  },
  DispatchDate: {
    screen: screens.DispatchDate,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_DATE'),
    }),
  },
  DispatchAssignTask: {
    screen: screens.DispatchAssignTask,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_ASSIGN_TASK'),
    }),
  },
}, {
  mode: 'modal',
  defaultNavigationOptions,
})
