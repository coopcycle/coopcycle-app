import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import AuthenticateForm from '../../components/AuthenticateForm'
import {forgotPassword, login, register} from '../../redux/App/actions'

class Login extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated && this.props.isAuthenticated === true) {
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
      <Container>
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            { this.props.t('CHECKOUT_LOGIN_DISCLAIMER') }
          </Text>
        </View>
        <Content padder extraScrollHeight={64}>
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
            }
            }
          />
        </Content>
      </Container>
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
    isAuthenticated: state.app.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    login: (email, password, navigate) => dispatch(login(email, password, navigate)),
    register: data => dispatch(register(data, 'CheckoutCheckEmail', 'CheckoutLogin', true)),
    forgotPassword: () => dispatch(forgotPassword()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Login))
