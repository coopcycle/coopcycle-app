import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import AuthenticateContainer from '../../components/AuthenticateContainer';
import AuthenticateForm from '../../components/AuthenticateForm';
import { forgotPassword, login, register } from '../../redux/App/actions';
import { selectCustomBuild } from '../../redux/App/selectors';
import Server from './components/Server';

class LoginRegister extends Component {
  render() {
    return (
      <AuthenticateContainer>
        {this.props.customBuild ? null : <Server />}
        <AuthenticateForm
          onLogin={(email, password) => this.props.login(email, password)}
          onRegister={data => this.props.register(data)}
          onForgotPassword={() => {
            this.props.forgotPassword();
            this.props.navigation.navigate('AccountForgotPassword', {
              checkEmailRouteName: 'AccountResetPasswordCheckEmail',
              resumeCheckoutAfterActivation: false,
            });
          }}
        />
      </AuthenticateContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    customBuild: selectCustomBuild(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: (email, password) => dispatch(login(email, password, true)),
    register: data =>
      dispatch(register(data, 'AccountRegisterCheckEmail', 'AccountHome')),
    forgotPassword: () => dispatch(forgotPassword()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(LoginRegister));
