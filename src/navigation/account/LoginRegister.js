import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Header, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import Server from './components/Server'
import AuthenticateForm from '../../components/AuthenticateForm'
import { login, register } from '../../redux/App/actions'

class LoginRegister extends Component {

  componentDidUpdate() {
    if (this.props.isAuthenticated) {
      this.props.navigation.navigate('AccountAuthenticated')
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.navigation.navigate('AccountAuthenticated')
    }
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <View style={styles.message}>
          <Text style={{ textAlign: 'center' }}>{this.props.message}</Text>
        </View>
      )
    }
  }

  render() {

    return (
      <Container>
        <Content padder>
          <Server />
          { this.renderMessage() }
          <AuthenticateForm
            onLogin={ (email, password) => this.props.login(email, password) }
            onRegister={ data => this.props.register(data) } />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
})

function mapStateToProps(state) {

  return {
    message: state.app.lastAuthenticationError,
    isAuthenticated: state.app.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    login: (email, password, navigate) => dispatch(login(email, password, true)),
    register: data => dispatch(register(data, 'AccountCheckEmail', 'AccountLoginRegister')),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(LoginRegister))
