import React from 'react'
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack'
import { createCompatNavigatorFactory } from '@react-navigation/compat'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import i18n from '../../i18n'
import screens, { defaultNavigationOptions, headerLeft } from '..'
import { stackNavigatorScreenOptions } from '../styles'
import HeaderButton from '../../components/HeaderButton'

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

function mapStateToProps(state) {

  return {
    currentRoute: state.app.currentRoute,
  }
}

const RootStack = createStackNavigator()

const StoreNav = withTranslation()(({ currentRoute, t }) => {

  const navigation = useNavigation()

  return (
    <RootStack.Navigator mode="modal"
      screenOptions={ stackNavigatorScreenOptions }>
      <RootStack.Screen
        name="StoreHome"
        component={ MainNavigator }
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="StoreNewDelivery"
        component={ NewDeliveryStack }
        options={{
          title: t('STORE_NEW_DELIVERY'),
          headerLeft: (props) => {

            let { onPress, title, backImage, ...otherProps } = props

            if (currentRoute === 'StoreNewDeliveryAddress') {
              title = t('CANCEL')
            } else {
              title = 'Back'
            }

            return (
              <HeaderBackButton { ...otherProps }
                onPress={ () => navigation.navigate('StoreHome') }
                title={ title }
                backImage={ backImage } />
            )
          }
        }} />
    </RootStack.Navigator>
  )
})

export default connect(mapStateToProps)(StoreNav)
