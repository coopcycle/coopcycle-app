import React, { Component } from 'react'
import { View } from 'react-native'
import { Icon, Text } from 'native-base'
import { createStackNavigator, HeaderBackButton } from 'react-navigation'

import i18n from '../../i18n'
import navigation, { defaultNavigationOptions, headerLeft } from '..'
import HeaderButton from '../../components/HeaderButton'
import SettingsNavigator from '../restaurant/SettingsNavigator'

const MainNavigator = createStackNavigator({
  StoreHome: {
    screen: navigation.StoreDashboard,
    navigationOptions: ({ navigation }) => {
      const store = navigation.getParam('store')
      const title = store ? store.name : ''

      return {
        title,
        headerLeft: headerLeft(navigation),
        headerRight: (
          <HeaderButton iconType="FontAwesome" iconName="plus"
            onPress={ () => navigation.navigate('StoreNewDelivery') } />
        ),
      }
    }
  },
  StoreDelivery: {
    screen: navigation.StoreDelivery,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('STORE_DELIVERY', { id: navigation.getParam('delivery').id }),
    })
  },
}, {
  initialRouteKey: 'StoreHome',
  initialRouteName: 'StoreHome',
  defaultNavigationOptions
})

const NewDeliveryStack = createStackNavigator({
  StoreNewDeliveryAddress: {
    screen: navigation.StoreNewDeliveryAddress,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  StoreNewDeliveryForm: {
    screen: navigation.StoreNewDeliveryForm,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'StoreNewDeliveryAddress'
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
  StoreHome: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  StoreNewDelivery: {
    screen: NewDeliveryStack,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      // header: null,
      title: i18n.t('STORE_NEW_DELIVERY'),
      headerLeft: (props) => {

        const routeName = getActiveRouteName(navigation.state)

        let { onPress, title, backImage, ...otherProps } = props

        if (routeName === 'StoreNewDeliveryAddress') {
          title = i18n.t('CANCEL')
        } else {
          title = 'Back'
        }

        return (
          <HeaderBackButton { ...otherProps }
            onPress={ () => navigation.goBack(null) }
            title={ title }
            backImage={ backImage } />
        )
      },
    })
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'StoreHome',
})
