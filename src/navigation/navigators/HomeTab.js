import React, { Component } from 'react'
import { Button, Icon } from 'native-base'
import { createBottomTabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import AccountPage from '../AccountPage'
import Home from '../Home'
import RestaurantsPage from '../RestaurantsPage'
import i18n from '../../i18n'

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

const TabNav = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('HOME'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" style={{ color: tintColor }} />
      ),
    })
  },
  Restaurants: {
    screen: RestaurantsPage,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('RESTAURANTS'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="restaurant" style={{ color: tintColor }} />
      ),
    })
  },
  Account: {
    screen: AccountPage,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: i18n.t('MY_ACCOUNT'),
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" style={{ color: tintColor }} />
      ),
    })
  },
}, tabNavigatorConfig)

class HomePage extends Component {

  static navigationOptions = ({ navigation }) => {

    const user = navigation.getParam('user')

    if (user && user.isAuthenticated()) {

      if (user.hasRole('ROLE_COURIER')) {
        headerRight = (
          <Button transparent onPress={ () => navigation.navigate('Courier', { connected: false, tracking: false }) }>
            <Icon name="ios-bicycle" style={{ color: '#fff' }} />
          </Button>
        )
      }

      if (user.hasRole('ROLE_RESTAURANT')) {
        headerRight = (
          <Button transparent onPress={ () => navigation.navigate('RestaurantList') }>
            <Icon name="restaurant" style={{ color: '#fff' }} />
          </Button>
        )
      }

    } else {
      headerRight = (
        <Button transparent />
      )
    }

    return {
      title: 'CoopCycle',
      headerRight
    }
  }

  componentDidUpdate() {
    if (this.props.user !== this.props.navigation.getParam('user')) {
      this.props.navigation.setParams({ user: this.props.user })
    }
  }

  render() {

    // Need to pass navigation prop from StackNavigator to trigger actions
    const screenProps = { ...this.props.navigation.state.params, navigation: this.props.navigation }

    return (
      <TabNav screenProps={ screenProps } />
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user
  }
}

module.exports = connect(mapStateToProps)(translate()(HomePage))
