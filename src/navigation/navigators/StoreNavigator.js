import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import i18n from '../../i18n'
import screens, { headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import HeaderButton from '../../components/HeaderButton'
import HeaderBackButton from '../store/components/HeaderBackButton'

const MainStack = createStackNavigator()

const MainNavigator = () => (
  <MainStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <MainStack.Screen
      name="StoreHome"
      component={ screens.StoreDashboard }
      options={ ({ navigation, route }) => {
        const store = route.params?.store
        const title = store ? store.name : ''

        return {
          title,
          headerLeft: headerLeft(navigation),
          headerRight: () =>
            <HeaderButton iconType="FontAwesome" iconName="plus"
              onPress={ () => navigation.navigate('StoreNewDelivery') } />
          ,
        }
      }}
    />
    <MainStack.Screen
      name="StoreDelivery"
      component={ screens.StoreDelivery }
      options={ ({ route }) => ({
        title: i18n.t('STORE_DELIVERY', { id: route.params?.delivery.id }),
      })}
    />
  </MainStack.Navigator>
)

const NewDeliveryStack = createStackNavigator()

const NewDeliveryNavigator = () => (
  <NewDeliveryStack.Navigator
    screenOptions={ stackNavigatorScreenOptions }>
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryAddress"
      component={ screens.StoreNewDeliveryAddress }
      options={{
        headerShown: false,
      }}
    />
    <NewDeliveryStack.Screen
      name="StoreNewDeliveryForm"
      component={ screens.StoreNewDeliveryForm }
      options={{
        headerShown: false,
      }}
    />
  </NewDeliveryStack.Navigator>
)

const RootStack = createStackNavigator()

export default () => (
  <RootStack.Navigator
    screenOptions={{ ...stackNavigatorScreenOptions, presentation: 'modal' }}>
    <RootStack.Screen
      name="StoreHome"
      component={ MainNavigator }
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name="StoreNewDelivery"
      component={ NewDeliveryNavigator }
      options={{
        title: i18n.t('STORE_NEW_DELIVERY'),
        headerLeft: (props) => <HeaderBackButton { ...props } />,
      }}
    />
  </RootStack.Navigator>
)
