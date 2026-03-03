import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthenticateContainer from '../../components/AuthenticateContainer';
import AuthenticateForm from '../../components/AuthenticateForm';
import {
  forgotPassword,
  guestModeOn,
  login,
  register,
} from '../../redux/App/actions';

class LoginRegister extends Component {
  state = {
    isKeyboardVisible: false,
  };

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = () => {
    this.setState({ isKeyboardVisible: true });
  };

  keyboardDidHide = () => {
    this.setState({ isKeyboardVisible: false });
  };

  render() {
    const { isKeyboardVisible } = this.state;
    const { guestCheckoutEnabled } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <AuthenticateContainer>
          {!isKeyboardVisible && guestCheckoutEnabled && (
            <>
              <Box className="p-4">
                <Button
                  testID="guestCheckoutButton"
                  action="success"
                  onPress={() => this.props.guestModeOn()}>
                  <ButtonText>{this.props.t('CHECKOUT_AS_GUEST')}</ButtonText>
                </Button>
              </Box>
              <Text className="text-center">{this.props.t('OR')}</Text>
            </>
          )}
          {!isKeyboardVisible && (
            <Box className="p-4">
              <Text className="text-center">
                {this.props.t('CHECKOUT_LOGIN_DISCLAIMER')}
              </Text>
            </Box>
          )}
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
      </SafeAreaView>
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
      dispatch(
        login(
          email,
          password,
          'CheckoutCheckEmail',
          'CheckoutLoginRegister',
          navigate,
        ),
      ),
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
)(withTranslation()(LoginRegister));
