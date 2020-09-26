import React from 'react'
import {
  createStackNavigator,
  HeaderBackButton } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'

import { stackNavigatorScreenOptions } from '../styles'
import screens from '..'

const Stack = createStackNavigator()

// TODO Override back button for the whole stack
// We need to override the back button behavior
// because otherwise when we hit "back" on the PoD screen,
// it goes back to the task screen
// headerLeft: (props) => {

//   let { onPress, title, backImage, ...otherProps } = props

//   return (
//     <HeaderBackButton { ...otherProps }
//       onPress={ () => navigation.goBack(null) }
//       title={ 'Back' }
//       backImage={ backImage } />
//   )
// },

export default withTranslation()(({ t }) => (
  <Stack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <Stack.Screen
      name="RestaurantSettingsHome"
      component={ screens.RestaurantSettings }
      options={{ headerShown: false }} />
    <Stack.Screen
      name="RestaurantProducts"
      component={ screens.RestaurantProducts }
      options={{
        title: t('RESTAURANT_PRODUCTS'),
        headerShown: false
      }} />
    <Stack.Screen
      name="RestaurantOpeningHours"
      component={ screens.RestaurantOpeningHours }
      options={{
        title: t('RESTAURANT_OPENING_HOURS'),
        headerShown: false
      }} />
    <Stack.Screen
      name="RestaurantMenus"
      component={ screens.RestaurantMenus }
      options={{
        title: t('RESTAURANT_MENUS'),
        headerShown: false
      }} />
    <Stack.Screen
      name="RestaurantPrinter"
      component={ screens.RestaurantPrinter }
      options={{
        title: t('RESTAURANT_PRINTER'),
        headerShown: false
      }} />
  </Stack.Navigator>
))
