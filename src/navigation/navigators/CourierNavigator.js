import React from 'react'
import { View } from 'react-native'
import { Button, Icon } from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { withTranslation } from 'react-i18next'

import TrackingIcon from '../../components/TrackingIcon'
import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import TaskNavigator from './TaskNavigator'

const Tabs = createBottomTabNavigator()
const MainStack = createStackNavigator()
const SettingsStack = createStackNavigator()

const TabNavigator = withTranslation()(({ t }) => (
  <Tabs.Navigator
    tabBarOptions={{
      showLabel: false,
    }}>
    <Tabs.Screen
      name="CourierTasks"
      component={ screens.CourierTasksPage }
      options={{
        title: t('TASKS'),
        tabBarTestID: 'messengerTabMap',
        tabBarIcon: ({ color }) => (
          <Icon type="FontAwesome" name="map" style={{ color }} />
        ),
      }} />
    <Tabs.Screen
      name="CourierTaskList"
      component={ screens.CourierTaskListPage }
      options={{
        title: t('TASK_LIST'),
        tabBarTestID: 'messengerTabList',
        tabBarIcon: ({ color }) => (
          <Icon type="FontAwesome" name="list" style={{ color }} />
        ),
      }} />
  </Tabs.Navigator>
))

const MainNavigator = withTranslation()(({ t }) => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="CourierHome"
      component={ TabNavigator }
      options={ ({ navigation, route }) => ({
        title: t('COURIER'),
        headerLeft: headerLeft(navigation, 'menuBtnCourier'),
        headerRight: () =>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
            <Button transparent onPress={() => navigation.navigate('CourierSettings')}>
              <Icon name="settings" style={{ color: 'white' }} />
            </Button>
            <Button transparent>
              <TrackingIcon />
            </Button>
          </View>
        ,
      })} />
    <MainStack.Screen
      name="Task"
      component={ TaskNavigator }
      options={{
        // headerShown: false
      }} />
  </MainStack.Navigator>
))

const SettingsNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <SettingsStack.Screen
      name="CourierSettings"
      component={ screens.CourierSettings } />
    <SettingsStack.Screen
      name="CourierSettingsTags"
      component={ screens.CourierSettingsTags } />
  </SettingsStack.Navigator>
)

/*
const MainNavigator = createStackNavigator({
  CourierHome: {
    screen: Tabs,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: headerLeft(navigation, 'menuBtnCourier'),
      headerRight: () =>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Button transparent onPress={() => navigation.navigate('CourierSettings')}>
            <Icon name="settings" style={{ color: 'white' }} />
          </Button>
          <Button transparent>
            <TrackingIcon />
          </Button>
        </View>
      ,
    }),
  },
  Task: {
    screen: TaskNavigator,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    }),
  },
}, {
  initialRouteKey: 'CourierHome',
  initialRouteName: 'CourierHome',
  defaultNavigationOptions,
})
*/

const RootStack = createStackNavigator()

export default withTranslation()(({ t }) => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    mode="modal">
    <RootStack.Screen
      name="Main"
      component={ MainNavigator }
      options={{
        headerShown: false
      }} />
    <RootStack.Screen
      name="CourierSettings"
      component={ SettingsNavigator }
      options={{
        title: t('SETTINGS')
      }} />
  </RootStack.Navigator>
))
