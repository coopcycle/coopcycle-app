import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { resetPassword } from '../../redux/App/actions'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'

class ForgotPassword extends Component {
  componentDidUpdate() {
    // a state when a user successfully requested to reset a password
    if (this.props.isRequested) {
      this.props.navigation.goBack()
    }
  }

  render() {
    return (
      <View style={ styles.content }>
        <ForgotPasswordForm
          onSubmit={username => {
            const {
              checkEmailRouteName,
              resumeCheckoutAfterActivation,
            } = this.props.route.params;
            this.props.resetPassword(username, checkEmailRouteName, resumeCheckoutAfterActivation);
          }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
})

function mapStateToProps(state) {
  return {
    isRequested: state.app.forgotPassword.requested,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (username, checkEmailRouteName, resumeCheckoutAfterActivation) =>
      dispatch(resetPassword(username, checkEmailRouteName, resumeCheckoutAfterActivation)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ForgotPassword))
