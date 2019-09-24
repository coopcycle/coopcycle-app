import React, {Component} from 'react'
import {Container, Content} from 'native-base'
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'
import {resetPassword} from '../../redux/App/actions'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'

class ForgotPassword extends Component {
  render() {
    return (
      <Container>
        <Content padder>
          <ForgotPasswordForm
            onSubmit={username => {
              const {checkEmailRouteName} = this.props.navigation.state.params;
              this.props.resetPassword(username, checkEmailRouteName);
            }}
          />
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: (username, checkEmailRouteName) =>
      dispatch(resetPassword(username, checkEmailRouteName)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ForgotPassword))
