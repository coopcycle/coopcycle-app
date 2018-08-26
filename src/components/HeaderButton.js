import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'

class HeaderButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={ this.props.onPress }
        style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
        <Icon name={ this.props.iconName } style={{ color: '#fff' }} />
      </TouchableOpacity>
    )
  }
}

function mapStateToProps(state) {
  return {
    status: state.restaurant.status
  }
}

export default HeaderButton
