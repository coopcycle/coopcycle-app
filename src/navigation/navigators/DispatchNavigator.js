import React from 'react'
import { Icon} from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import i18n from '../../i18n'
import HeaderRightButton from '../dispatch/HeaderRightButton'
import TaskNavigator from './TaskNavigator'
import screens, { defaultNavigationOptions, headerLeft } from '..'
import HeaderBackButton from '../task/components/HeaderBackButton'

const Tabs = createCompatNavigatorFactory(createBottomTabNavigator)({
  DispatchUnassignedTasks: {
    screen: screens.DispatchUnassignedTasks,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_UNASSIGNED_TASKS'),
      tabBarTestID: 'dispatch:unassignedTab',
      tabBarIcon: ({ focused, horizontal, color }) => {
        return (
          <Icon type="FontAwesome" name="clock-o" style={{ color }} />
        )
      },
    }),
  },
  DispatchTaskLists: {
    screen: screens.DispatchTaskLists,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH_TASK_LISTS'),
      tabBarTestID: 'dispatch:assignedTab',
      tabBarIcon: ({ focused, horizontal, color }) => {
        return (
          <Icon type="FontAwesome" name="user" style={{ color }} />
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

const MainNavigator = createCompatNavigatorFactory(createStackNavigator)({
  DispatchHome: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH'),
      headerLeft: headerLeft(navigation, 'menuBtnDispatch'),
      headerRight: () => <HeaderRightButton onPress={ () => navigation.navigate('DispatchDate') } />,
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
      title: `${i18n.t('TASK')} #${navigation.state.params.params.task.id}`,
      // We need to override the back button behavior
      // because otherwise when we hit "back" on the PoD screen,
      // it goes back to the task screen
      headerLeft: (props) => <HeaderBackButton { ...props } />
    }),
  },
}, {
  initialRouteKey: 'DispatchHome',
  initialRouteName: 'DispatchHome',
  defaultNavigationOptions,
})

const AddTaskNavigator = createCompatNavigatorFactory(createStackNavigator)({
  DispatchAddTaskHome: {
    screen: screens.DispatchAddTask,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
  DispatchEditAddress: {
    screen: screens.DispatchEditAddress,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
    }),
  },
}, {
  initialRouteName: 'DispatchAddTaskHome',
  defaultNavigationOptions,
})

export default createCompatNavigatorFactory(createStackNavigator)({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      headerShown: false,
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
