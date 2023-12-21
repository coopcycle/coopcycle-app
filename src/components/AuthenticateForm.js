import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'native-base'
import { withTranslation } from 'react-i18next'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

class AuthenticateForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      formToDisplay: 'login',
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
        onForgotPassword={ () => this.props.onForgotPassword() }
        withFacebook={ this.props.withFacebook }
        withGoogle={ this.props.withGoogle } />
    )
  }

  render() {

    const { formToDisplay } = this.state

    const alternateForm = formToDisplay === 'login' ? 'register' : 'login'
    const btnLabel = formToDisplay === 'login' ? 'OR_REGISTER' : 'OR_LOGIN'

    return (
      <View flex={1} style={{ width: '80%' }} justifyContent="center">
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
  spacer: {
    alignItems: 'center',
    padding: 20,
  },
})

export default withTranslation()(AuthenticateForm)
