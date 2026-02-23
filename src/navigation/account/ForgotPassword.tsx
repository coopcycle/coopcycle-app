import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { resetPassword } from '../../redux/App/actions';

class ForgotPassword extends Component {

  render() {
    return (
      <View style={styles.content}>
        <ForgotPasswordForm
          onSubmit={username => {
            const { checkEmailRouteName, resumeCheckoutAfterActivation } =
              this.props.route.params;
            this.props.resetPassword(
              username,
              checkEmailRouteName,
              resumeCheckoutAfterActivation,
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
});

function mapStateToProps(state) {
  return {
    isRequested: state.app.forgotPassword.requested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (
      username,
      checkEmailRouteName,
      resumeCheckoutAfterActivation,
    ) =>
      dispatch(
        resetPassword(
          username,
          checkEmailRouteName,
          resumeCheckoutAfterActivation,
        ),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ForgotPassword));
