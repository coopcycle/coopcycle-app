import { Center } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setNewPassword } from '../../redux/App/actions';
import { selectIsAuthenticated } from '../../redux/App/selectors';

import NewPasswordForm from '../../components/NewPasswordForm';

class ResetPasswordNewPassword extends Component {
  componentDidUpdate() {
    // a state when a user successfully set new password
    if (this.props.isAuthenticated) {
      this.props.navigation.goBack();
    }
  }

  _onSetNewPassword(password) {
    const token = this.props.route.params?.token;
    if (token) {
      this.props.setNewPassword(token, password);
    }
  }

  render() {
    return (
      <Center flex={1}>
        <NewPasswordForm
          onSubmit={password => this._onSetNewPassword(password)}
        />
      </Center>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: selectIsAuthenticated(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNewPassword: (token, password) =>
      dispatch(setNewPassword(token, password)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ResetPasswordNewPassword));
