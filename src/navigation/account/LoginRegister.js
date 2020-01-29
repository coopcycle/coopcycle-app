import React, { Component } from 'react'
import { View } from 'react-native'
import {
  Container, Content, Text,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import Server from './components/Server'
import AuthenticateForm from '../../components/AuthenticateForm'
import { login, register, forgotPassword } from '../../redux/App/actions'

class LoginRegister extends Component {

  renderMessage() {
    if (this.props.message) {
      return (
        <View>
          <Text style={{ textAlign: 'center' }}>{this.props.message}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <Container>
        <Content padder extraScrollHeight={64}>
          <Server />
          { this.renderMessage() }
          <AuthenticateForm
            country={ this.props.country }
            onLogin={(email, password) => this.props.login(email, password)}
            onRegister={data => this.props.register(data)}
            onForgotPassword={() => {
              this.props.forgotPassword()
              this.props.navigation.navigate('AccountForgotPassword', {
                checkEmailRouteName: 'AccountResetPasswordCheckEmail',
                resumeCheckoutAfterActivation: false,
              })
            }
            }
          />
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    country: state.app.settings.country.toUpperCase(),
    message: state.app.lastAuthenticationError,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password, navigate) => dispatch(login(email, password, true)),
    register: data => dispatch(register(data, 'AccountRegisterCheckEmail', 'AccountHome')),
    forgotPassword: () => dispatch(forgotPassword()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LoginRegister))
