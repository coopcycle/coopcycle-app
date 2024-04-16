import { Button, Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import AuthenticateContainer from '../../components/AuthenticateContainer';
import AuthenticateForm from '../../components/AuthenticateForm';
import {
  forgotPassword,
  guestModeOn,
  login,
  register,
} from '../../redux/App/actions';

class Login extends Component {
  render() {
    return (
      <AuthenticateContainer>
        {this.props.guestCheckoutEnabled && (
          <>
            <View
              style={{ paddingTop: 20, paddingHorizontal: 40, width: '100%' }}>
              <Button
                colorScheme="success"
                onPress={() => this.props.guestModeOn()}>
                {this.props.t('CHECKOUT_AS_GUEST')}
              </Button>
            </View>

            <Text mt="4">{this.props.t('OR')}</Text>
          </>
        )}
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            {this.props.t('CHECKOUT_LOGIN_DISCLAIMER')}
          </Text>
        </View>
        <AuthenticateForm
          onLogin={(email, password) =>
            this.props.login(email, password, false)
          }
          onRegister={data => this.props.register(data)}
          onForgotPassword={() => {
            this.props.forgotPassword();
            this.props.navigation.navigate('CheckoutForgotPassword', {
              checkEmailRouteName: 'CheckoutResetPasswordCheckEmail',
              resumeCheckoutAfterActivation: true,
            });
          }}
        />
      </AuthenticateContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    guestCheckoutEnabled: state.app.settings.guest_checkout_enabled,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password, navigate) =>
      dispatch(login(email, password, navigate)),
    register: data =>
      dispatch(
        register(data, 'CheckoutCheckEmail', 'CheckoutLoginRegister', true),
      ),
    forgotPassword: () => dispatch(forgotPassword()),
    guestModeOn: () => dispatch(guestModeOn()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Login));
