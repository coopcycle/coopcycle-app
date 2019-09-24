import React, { Component } from 'react'
import { Container, Content } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { setNewPassword } from '../../redux/App/actions'
import NewPasswordForm from '../../components/NewPasswordForm'

class ResetPasswordNewPassword extends Component {
  componentDidUpdate() {
    // a state when a user successfully set new password
    if (this.props.isAuthenticated) {
      this.props.navigation.goBack()
    }
  }

  _onSetNewPassword(password) {
    const token = this.props.navigation.getParam('token', null)
    if (token) {
      this.props.setNewPassword(token, password)
    }
  }

  render() {
    return (
      <Container>
        <Content padder>
          <NewPasswordForm
            onSubmit={ password => this._onSetNewPassword(password) } />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.app.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setNewPassword: (token, password) => dispatch(setNewPassword(token, password)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ResetPasswordNewPassword))
