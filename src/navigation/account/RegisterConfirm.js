import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Container, Content, Button, Text, Icon,
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { confirmRegistration } from '../../redux/App/actions'

class RegisterConfirm extends Component {

  componentDidMount() {

    const token = this.props.navigation.getParam('token', null)

    if (token) {
      console.log('TOKEN', token);
      this.props.confirmRegistration(token)
    }
  }

  render() {

    return (
      <Container>
        <Content padder>
          <Text>
            IT WORKS
          </Text>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
  }
}

function mapDispatchToProps(dispatch) {

  return {
    confirmRegistration: token => dispatch(confirmRegistration(token)),
  }
}

const styles = StyleSheet.create({

})

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(RegisterConfirm))
