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
import HeaderButton from '../../components/HeaderButton'

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

const ProofOfDeliveryTabs = createMaterialTopTabNavigator({
  TaskPhoto: {
    screen: navigation.CourierPhoto,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PHOTO')
    })
  },
  TaskSignature: {
    screen: navigation.CourierSignature,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SIGNATURE')
    })
  }
}, {
  // Disable swipe to avoid swiping when signing
  swipeEnabled: false
})

const CompleteStack = createStackNavigator({
  TaskCompleteHome: {
    screen: navigation.CourierTaskComplete,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  TaskCompleteProofOfDelivery: {
    screen: ProofOfDeliveryTabs,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'TaskCompleteHome',
  navigationOptions: ({ navigation }) => ({
    // We need to override the back button behavior
    // because otherwise when we hit "back" on the PoD screen,
    // it goes back to the task screen
    headerLeft: (props) => {
      const { onPress, ...otherProps } = props
      return (
        <HeaderBackButton { ...otherProps } onPress={ () => navigation.goBack(null) } />
      )
    }
  })

})

export default createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  TaskComplete: {
    screen: CompleteStack,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
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
