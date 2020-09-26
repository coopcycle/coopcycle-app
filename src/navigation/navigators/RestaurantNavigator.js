import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { withTranslation } from 'react-i18next'

import { stackNavigatorScreenOptions } from '../styles'
import screens, { headerLeft } from '..'

import HeaderRight from '../restaurant/components/HeaderRight'
import SettingsNavigator from '../restaurant/SettingsNavigator'
import OrderNumber from '../../components/OrderNumber'

const MainStack = createStackNavigator()
const RootStack = createStackNavigator()

const MainStackScreen = withTranslation()(({ t }) => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="RestaurantHome"
      component={ screens.RestaurantDashboard }
      options={ ({ navigation, route }) => ({
        // FIXME Doesn't work
        title: route.params?.restaurant?.name ?? '',
        headerLeft: headerLeft(navigation),
        headerRight: () => <HeaderRight navigation={ navigation } />,
      })} />
    <MainStack.Screen
      name="RestaurantOrder"
      component={ screens.RestaurantOrder }
      options={ ({ navigation, route }) => ({
        headerTitle: () => <OrderNumber
          order={ route.params?.order }
          color={ '#ffffff' } />,
      })} />
  </MainStack.Navigator>
))

export default withTranslation()(({ t }) => (
  <RootStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }
    mode="modal">
    <RootStack.Screen
      name="Main"
      component={ MainStackScreen }
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="RestaurantOrderRefuse"
      component={ screens.RestaurantOrderRefuse }
      // TODO Translate
      options={{ title: 'Refuse order' }} />
    <RootStack.Screen
      name="RestaurantOrderDelay"
      component={ screens.RestaurantOrderDelay }
      options={{ title: t('RESTAURANT_ORDER_DELAY_MODAL_TITLE') }} />
    <RootStack.Screen
      name="RestaurantOrderCancel"
      component={ screens.RestaurantOrderCancel }
      options={{ title: t('RESTAURANT_ORDER_CANCEL_MODAL_TITLE') }} />
    <RootStack.Screen
      name="RestaurantDate"
      component={ screens.RestaurantDate }
      // TODO Translate
      options={{ title: 'Choose date' }} />
    <RootStack.Screen
      name="RestaurantList"
      component={ screens.RestaurantList }
      options={{ title: t('RESTAURANTS') }} />
    <RootStack.Screen
      name="RestaurantSettings"
      component={ SettingsNavigator }
      // TODO Translate
      options={{ title: t('SETTINGS') }} />
  </RootStack.Navigator>
))
