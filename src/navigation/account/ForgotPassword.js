import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Header, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import {resetPassword} from '../../redux/App/actions'
import ForgotPasswordForm from '../../components/ForgotPasswordForm';

class ForgotPassword extends Component {
  render() {
    return (
      <Container>
        <Content padder>
          <ForgotPasswordForm
            onSubmit={ (email) => this.props.resetPassword(email) } />
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
    resetPassword: (email) => dispatch(resetPassword(email, 'AccountResetPasswordCheckEmail', 'AccountLoginRegister'))
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ForgotPassword))
