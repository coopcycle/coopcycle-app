import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Container, Content, Button, Text, Icon,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { setNewPassword } from '../../redux/App/actions'
import NewPasswordForm from '../../components/NewPasswordForm'

class ResetPasswordNewPassword extends Component {

  componentDidMount() {

    // if (token) {
    //   this.props.confirmRegistration(token)
    // }
  }

  render() {

    return (
      <Container>
        <Content padder>
          <NewPasswordForm
            onSubmit={ (password) => {
              const token = this.props.navigation.getParam('token', null)
              this.props.setNewPassword(token, password)
            } } />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setNewPassword: (token, password) => dispatch(setNewPassword(token, password)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ResetPasswordNewPassword))
