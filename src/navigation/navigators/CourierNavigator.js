import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

import i18n from '../../i18n'
import TrackingIcon from '../../components/TrackingIcon'
import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import TaskNavigator from './TaskNavigator'

const Tab = createBottomTabNavigator()

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
    }}
    >
    <Tab.Screen
      name="CourierTasks"
      component={ screens.CourierTasksPage }
      options={ ({ navigation }) => ({
        title: i18n.t('TASKS'),
        tabBarTestID: 'messengerTabMap',
        tabBarIcon: ({ color }) => {
          return (
            <Icon as={ FontAwesome } name="map" style={{ color }} />
          )
        },
      })}
    />
    <Tab.Screen
      name="CourierTaskList"
      component={ screens.CourierTaskListPage }
      options={ ({ navigation }) => ({
        title: i18n.t('TASK_LIST'),
        tabBarTestID: 'messengerTabList',
        tabBarIcon: ({ color }) => {
          return (
            <Icon as={ FontAwesome } name="list" style={{ color }} />
          )
        },
      })}
    />
  </Tab.Navigator>
)

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
      <Icon as={ Ionicons } name={ name } style={{ color: 'white' }} />
    </TouchableOpacity>
  )
}

const MainStack = createStackNavigator()

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="CourierHome"
      component={ Tabs }
      options={ ({ navigation }) => ({
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
      })}
    />
    <MainStack.Screen
      name="Task"
      component={ TaskNavigator }
      options={{
        headerShown: false,
      }}
    />
  </MainStack.Navigator>
)

const SettingsStack = createStackNavigator()

const SettingsNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <SettingsStack.Screen
      name="CourierSettingsHome"
      component={ screens.CourierSettings }
      options={{
        title: i18n.t('SETTINGS'),
      }}
    />
    <SettingsStack.Screen
      name="CourierSettingsTags"
      component={ screens.CourierSettingsTags }
      options={{
        title: i18n.t('FILTER_BY_TAGS'),
      }}
    />
  </SettingsStack.Navigator>
)

const RootStack = createStackNavigator()

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="Main"
      component={ MainNavigator }
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="CourierSettings"
      component={ SettingsNavigator }
      options={{
        headerShown: false,
      }}
    />
  </RootStack.Navigator>
)
