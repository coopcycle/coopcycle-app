import React, { Component } from 'react'
import { View } from 'react-native'
import { Center } from 'native-base'
import { connect } from 'react-redux'

import { confirmRegistration } from '../../redux/App/actions'

class RegisterConfirm extends Component {
  componentDidMount() {
    const token = this.props.route.params?.token
    if (token) {
      this.props.confirmRegistration(token)
    }
  }

  render() {
    return (
      <Center>
        <View />
      </Center>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    confirmRegistration: token => dispatch(confirmRegistration(token)),
  }
}

export default connect(() => ({}), mapDispatchToProps)(RegisterConfirm)
