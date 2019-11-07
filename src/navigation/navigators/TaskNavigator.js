import React, { Component } from 'react'
import { Icon } from 'native-base'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  HeaderBackButton } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'

const ProofOfDeliveryTabs = createMaterialTopTabNavigator({
  TaskPhoto: {
    screen: navigation.TaskPhoto,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PHOTO'),
    }),
  },
  TaskSignature: {
    screen: navigation.TaskSignature,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SIGNATURE'),
    }),
  },
}, {
  // Disable swipe to avoid swiping when signing
  swipeEnabled: false,
})

const CompleteStack = createStackNavigator({
  TaskCompleteHome: {
    screen: navigation.TaskComplete,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  TaskCompleteProofOfDelivery: {
    screen: ProofOfDeliveryTabs,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'TaskCompleteHome',
})

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

export default createStackNavigator({
  TaskHome: {
    screen: navigation.TaskHome,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
  TaskComplete: {
    screen: CompleteStack,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'TaskHome',
  navigationOptions: ({ navigation }) => ({
    // We need to override the back button behavior
    // because otherwise when we hit "back" on the PoD screen,
    // it goes back to the task screen
    headerLeft: (props) => {

      const routeName = getActiveRouteName(navigation.state)

      let { onPress, title, backImage, ...otherProps } = props

      if (routeName === 'TaskCompleteHome') {
        title = i18n.t('CANCEL')
      }
      if (routeName === 'TaskPhoto' || routeName === 'TaskSignature' || routeName === 'TaskHome') {
        title = 'Back'
      }

      return (
        <HeaderBackButton { ...otherProps }
          onPress={ () => navigation.goBack(null) }
          title={ title }
          backImage={ backImage } />
      )
    },
  }),
})
