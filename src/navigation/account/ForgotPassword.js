import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Header, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import { login, register } from '../../redux/App/actions'
import ForgotPasswordForm from '../../components/ForgotPasswordForm';

class ForgotPassword extends Component {
  render() {
    return (
      <Container>
        <Content padder>
          <ForgotPasswordForm
            onLogin={ (email, password) => this.props.login(email, password) }
            onRegister={ data => this.props.register(data) }
            onForgotPassword={ () => this.props.navigation.navigate('AccountForgotPassword') } />
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {
    // message: state.app.lastAuthenticationError,
    // isAuthenticated: state.app.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    // login: (email, password, navigate) => dispatch(login(email, password, true)),
    // register: data => dispatch(register(data, 'AccountCheckEmail', 'AccountLoginRegister')),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(ForgotPassword))
