import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'

import i18n from '../../i18n'
import screens, { defaultNavigationOptions, headerLeft } from '..'
import HeaderButton from '../../components/HeaderButton'
import HeaderBackButton from '../store/components/HeaderBackButton'

const MainNavigator = createCompatNavigatorFactory(createStackNavigator)({
  StoreHome: {
    screen: screens.StoreDashboard,
    navigationOptions: ({ navigation }) => {
      const store = navigation.getParam('store')
      const title = store ? store.name : ''

      return {
        title,
        headerLeft: headerLeft(navigation),
        headerRight: () =>
          <HeaderButton iconType="FontAwesome" iconName="plus"
            onPress={ () => navigation.navigate('StoreNewDelivery') } />
        ,
      }
    },
  },
  StoreDelivery: {
    screen: screens.StoreDelivery,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('STORE_DELIVERY', { id: navigation.getParam('delivery').id }),
    }),
  },
}, {
  initialRouteKey: 'StoreHome',
  initialRouteName: 'StoreHome',
  defaultNavigationOptions,
})

const NewDeliveryStack = createCompatNavigatorFactory(createStackNavigator)({
  StoreNewDeliveryAddress: {
    screen: screens.StoreNewDeliveryAddress,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
  StoreNewDeliveryForm: {
    screen: screens.StoreNewDeliveryForm,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'StoreNewDeliveryAddress',
})

export default createCompatNavigatorFactory(createStackNavigator)({
  StoreHome: {
    screen: MainNavigator,
    navigationOptions: ({ navigation }) => ({
      headerShown: false,
    }),
  },
  StoreNewDelivery: {
    screen: NewDeliveryStack,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('STORE_NEW_DELIVERY'),
      headerLeft: (props) => <HeaderBackButton { ...props } />,
    }),
  },
}, {
  defaultNavigationOptions,
  mode: 'modal',
  initialRouteName: 'StoreHome',
})
