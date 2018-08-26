import React, { Component } from 'react'
import HeaderButton from './HeaderButton'

import { connect } from 'react-redux'

class RestaurantStatusButton extends Component {
  render() {
    const { navigate } = this.props.navigation

    let iconName
    switch (this.props.status) {
      case 'rush':
        iconName = 'time'
        break;
      case 'disabled':
        iconName = 'warning'
        break;
      case 'available':
      default:
        iconName = 'checkmark'
        break;
    }

    return (
      <HeaderButton iconName={ iconName }
        onPress={ () => navigate('RestaurantStatus') } />
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.restaurant.status
  }
}

export default connect(mapStateToProps)(RestaurantStatusButton)
