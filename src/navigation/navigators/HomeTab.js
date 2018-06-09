import React, { Component } from 'react'
import { Button, Icon } from 'native-base'
import { TabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import AccountPage from '../AccountPage'
import HomeTab from '../HomeTab'
import RestaurantsPage from '../RestaurantsPage'

class HomePage extends Component {

  static navigationOptions = ({ navigation }) => {

    const user = navigation.getParam('user')

    if (user && user.isAuthenticated() && (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN'))) {
      headerRight = (
        <Button transparent onPress={ () => navigation.navigate('Courier', { connected: false, tracking: false }) }>
          <Icon name="ios-bicycle" style={{ color: '#fff' }} />
        </Button>
      )
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
    const user = this.props.navigation.getParam('user')
    if (!user) {
      this.props.navigation.setParams({ user: this.props.user })
    }
  }

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

function mapStateToProps(state) {
  return {
    user: state.app.user
  }
}

module.exports = connect(mapStateToProps)(translate()(HomePage))
