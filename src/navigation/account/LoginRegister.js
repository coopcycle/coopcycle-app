import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Server from './components/Server';
import AuthenticateForm from '../../components/AuthenticateForm';
import { forgotPassword, login, register } from '../../redux/App/actions';
import { redColor } from '../../styles/common';
import AuthenticateContainer from '../../components/AuthenticateContainer';

class LoginRegister extends Component {
  renderMessage() {
    if (this.props.message) {
      return (
        <View>
          <Text style={{ textAlign: 'center', color: redColor }}>{this.props.message}</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <AuthenticateContainer>
        { this.props.customBuild ? null : <Server /> }
        { this.renderMessage() }
        <AuthenticateForm
          onLogin={(email, password) => this.props.login(email, password)}
          onRegister={data => this.props.register(data)}
          onForgotPassword={() => {
            this.props.forgotPassword()
            this.props.navigation.navigate('AccountForgotPassword', {
              checkEmailRouteName: 'AccountResetPasswordCheckEmail',
              resumeCheckoutAfterActivation: false,
            })
          }}
          withFacebook={ Platform.OS !== 'ios' }
          withGoogle={ Platform.OS !== 'ios' } />
      </AuthenticateContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.app.lastAuthenticationError,
    customBuild: state.app.customBuild,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password, navigate) => dispatch(login(email, password, true)),
    register: data => dispatch(register(data, 'AccountRegisterCheckEmail', 'AccountHome')),
    forgotPassword: () => dispatch(forgotPassword()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LoginRegister))
