import React, { Component } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { Button, Text, View } from 'native-base'
import { withTranslation } from 'react-i18next'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { redColor } from '../styles/common'
import { connect } from 'react-redux'
import {
  clearAuthenticationErrors,
} from '../redux/App/actions'

class AuthenticateForm extends Component {

  constructor(props) {
    super(props)

    props.clearErrors()

    this.state = {
      formToDisplay: 'login',
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <View style={styles.messageContainer}>
          <Text style={{ textAlign: 'center', color: redColor }}>{this.props.message}</Text>
        </View>
      )
    }
  }

  renderForm() {

    if (this.state.formToDisplay === 'register') {

      return (
        <RegisterForm
          onSubmit={ data => this.props.onRegister(data) } />
      )
    }

    return (
      <LoginForm
        onSubmit={ (email, password) => this.props.onLogin(email, password) }
        onForgotPassword={ this.props.onForgotPassword }
        withFacebook={ Platform.OS !== 'ios' }
        withGoogle={ Platform.OS !== 'ios' } />
    )
  }

  render() {

    const { formToDisplay } = this.state

    const alternateForm = formToDisplay === 'login' ? 'register' : 'login'
    const btnLabel = formToDisplay === 'login' ? 'OR_REGISTER' : 'OR_LOGIN'

    return (
      <View flex={1} style={{ width: '80%' }} justifyContent="center">
        { this.renderMessage() }
        { this.renderForm() }
        <View style={{ marginTop: 10 }}>
          <Button size="sm" variant="link" onPress={() => this.setState({ formToDisplay: alternateForm, message: '' })} testID="loginOrRegister">
            {this.props.t(btnLabel)}
          </Button>
        </View>
        {/* This empty view is for increasing the page height so the button appears above the menu bar */}
        <View style={ styles.spacer } />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    padding: 20,
  },
  spacer: {
    alignItems: 'center',
    padding: 20,
  },
})

function mapStateToProps(state) {
  return {
    message: state.app.lastAuthenticationError,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clearErrors: () => dispatch(clearAuthenticationErrors()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AuthenticateForm))
