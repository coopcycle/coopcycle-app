import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import HeaderButton from './HeaderButton'

class HeaderRightButton extends Component {
  render() {

    const { user, restaurant } = this.props

    if (user && user.isAuthenticated()) {
      if (user.hasRole('ROLE_COURIER')) {
        return (
          <HeaderButton iconName="ios-bicycle"
            onPress={ () => this.props.navigation.navigate('Courier', { connected: false, tracking: false }) } />
        )
      }
      if (user.hasRole('ROLE_RESTAURANT') && restaurant) {
        return (
          <HeaderButton iconName="restaurant"
            onPress={ () => this.props.navigation.navigate('RestaurantDashboard') } />
        )
      }
    }

    return (
      <View />
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user,
    restaurant: state.restaurant.restaurant,
  }
}

export default connect(mapStateToProps)(HeaderRightButton)
