import React, { Component } from 'react'
import { Button, Icon } from 'native-base'

import { translate } from 'react-i18next'
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
      <Button transparent onPress={ () => navigate('RestaurantStatus') }>
        <Icon name={ iconName } style={{ color: '#fff' }} />
      </Button>
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.restaurant.status
  }
}

export default connect(mapStateToProps)(translate()(RestaurantStatusButton))
