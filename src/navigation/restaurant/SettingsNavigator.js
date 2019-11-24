import React from 'react'
import {
  createStackNavigator,
  HeaderBackButton } from 'react-navigation'

import i18n from '../../i18n'
import screens, { defaultNavigationOptions } from '..'

export default createStackNavigator({
  RestaurantSettingsHome: {
    screen: screens.RestaurantSettings,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
    }),
  },
  RestaurantProducts: {
    screen: screens.RestaurantProducts,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_PRODUCTS'),
    }),
  },
  RestaurantOpeningHours: {
    screen: screens.RestaurantOpeningHours,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_OPENING_HOURS'),
    }),
  },
  RestaurantMenus: {
    screen: screens.RestaurantMenus,
    navigationOptions: ({ navigation }) => ({
      // Use header = null to get rid of the header
      // The screen's header will be used
      header: null,
      title: i18n.t('RESTAURANT_MENUS'),
    }),
  },
}, {
  defaultNavigationOptions,
  initialRouteName: 'RestaurantSettingsHome',
  navigationOptions: ({ navigation }) => ({
    // We need to override the back button behavior
    // because otherwise when we hit "back" on the PoD screen,
    // it goes back to the task screen
    headerLeft: (props) => {

      let { onPress, title, backImage, ...otherProps } = props

      return (
        <HeaderBackButton { ...otherProps }
          onPress={ () => navigation.goBack(null) }
          title={ 'Back' }
          backImage={ backImage } />
      )
    },
  }),
})
