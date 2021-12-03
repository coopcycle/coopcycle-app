import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, Center } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import AuthenticateForm from '../../components/AuthenticateForm'
import {guestModeOn, forgotPassword, login, register} from '../../redux/App/actions'
import { selectIsAuthenticated } from '../../redux/App/selectors'

class Login extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated && this.props.isAuthenticated) {
      this.props.navigation.navigate('CheckoutMoreInfos')
    }
  }

  renderMessage() {
    if (this.props.message) {

      return (
        <View style={ styles.message }>
          <Text style={{ textAlign: 'center' }}>{ this.props.message }</Text>
        </View>
      )
    }
  }

  render() {

    return (
      <Center flex={ 1 }>
        <View style={{ paddingHorizontal: 40, width: '100%' }}>
          <Button colorScheme="success" onPress={() => this.props.guestModeOn()}>
            { this.props.t('CHECKOUT_AS_GUEST') }
          </Button>
        </View>

        <Text mt="4">{ this.props.t('OR') }</Text>

        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            { this.props.t('CHECKOUT_LOGIN_DISCLAIMER') }
          </Text>
        </View>
        { this.renderMessage() }
        <AuthenticateForm
          onLogin={(email, password) =>
            this.props.login(email, password, false)
          }
          onRegister={data => this.props.register(data)}
          onForgotPassword={() => {
            this.props.forgotPassword()
            this.props.navigation.navigate('CheckoutForgotPassword', {
              checkEmailRouteName: 'CheckoutResetPasswordCheckEmail',
              resumeCheckoutAfterActivation: true,
            })
          }}
          registrationErrors={ this.props.registrationErrors } />
      </Center>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    padding: 20,
  },
})

function mapStateToProps(state) {

  return {
    message: state.app.lastAuthenticationError,
    isAuthenticated: selectIsAuthenticated(state),
    registrationErrors: state.app.registrationErrors,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    login: (email, password, navigate) => dispatch(login(email, password, navigate)),
    register: data => dispatch(register(data, 'CheckoutCheckEmail', 'CheckoutLogin', true)),
    forgotPassword: () => dispatch(forgotPassword()),
    guestModeOn: () => dispatch(guestModeOn()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Login))
