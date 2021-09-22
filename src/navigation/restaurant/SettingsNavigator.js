import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import i18n from '../../i18n'
import screens from '..'
import { stackNavigatorScreenOptions } from '../styles'
import ProductOptions from './ProductOptions'

const RootStack = createStackNavigator()

export default () => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <RootStack.Screen
      name="RestaurantSettingsHome"
      component={ screens.RestaurantSettings }
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="RestaurantProducts"
      component={ screens.RestaurantProducts }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT_PRODUCTS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantProductOptions"
      component={ ProductOptions }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT_PRODUCT_OPTIONS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantOpeningHours"
      component={ screens.RestaurantOpeningHours }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT_OPENING_HOURS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantMenus"
      component={ screens.RestaurantMenus }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT_MENUS'),
      }}
    />
    <RootStack.Screen
      name="RestaurantPrinter"
      component={ screens.RestaurantPrinter }
      options={{
        headerShown: false,
        title: i18n.t('RESTAURANT_PRINTER'),
      }}
    />
  </RootStack.Navigator>
)
