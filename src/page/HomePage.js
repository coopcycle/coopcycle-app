import React, { Component } from 'react'
import {
  Icon
} from 'native-base';
import { TabNavigator } from 'react-navigation'
import { translate } from 'react-i18next'
import AccountPage from './AccountPage'
import HomeTab from './HomeTab'
import RestaurantsPage from './RestaurantsPage'

class HomePage extends Component {

  render() {

    const tabNavigatorConfig = {
      tabBarPosition: 'bottom',
      tabBarOptions: {
        activeTintColor: '#e4022d',
        inactiveTintColor: '#4c4c4c',
        showLabel: false,
        showIcon: true,
        style: {
          backgroundColor: '#fff',
        },
        indicatorStyle: {
          backgroundColor: '#e4022d'
        }
      },
    }

    // Need to pass navigation prop from StackNavigator to trigger actions
    const screenProps = { ...this.props.navigation.state.params, navigation: this.props.navigation }

    const TabNav = TabNavigator({
      Home: {
        screen: HomeTab,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: this.props.t('HOME'),
          tabBarIcon: ({ tintColor }) => (
            <Icon name="home" style={{ color: tintColor }} />
          ),
        })
      },
      Restaurants: {
        screen: RestaurantsPage,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: this.props.t('RESTAURANTS'),
          tabBarIcon: ({ tintColor }) => (
            <Icon name="restaurant" style={{ color: tintColor }} />
          ),
        })
      },
      Account: {
        screen: AccountPage,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: this.props.t('MY_ACCOUNT'),
          tabBarIcon: ({ tintColor }) => (
            <Icon name="person" style={{ color: tintColor }} />
          ),
        })
      },
    }, tabNavigatorConfig)

    return (
      <TabNav screenProps={ screenProps } />
    )
  }
}

module.exports = translate()(HomePage);
