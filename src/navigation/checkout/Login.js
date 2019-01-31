import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Text, Button, Icon } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { StackActions } from 'react-navigation'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { incrementItem, decrementItem } from '../../redux/Checkout/actions'
import { login, setLoading } from '../../redux/App/actions'

import AuthenticateForm from '../../components/AuthenticateForm'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
  }

  onRequestStart() {
    this.setState({
      message: '',
    })
    this.props.setLoading(true)
  }

  onRequestEnd() {
    this.props.setLoading(false)
  }

  async onLoginSuccess(user) {
    this.props.login(user, false)

    this.props.navigation.dispatch(StackActions.pop({ n: 1 }))
    this.props.navigation.navigate('CartAddress')
  }

  onLoginFail(message) {
    this.setState({ message })
  }

  renderMessage() {
    if (this.state.message) {
      return (
        <View style={ styles.message }>
          <Text style={{ textAlign: 'center' }}>{ this.state.message }</Text>
        </View>
      )
    }
  }

  render() {

    return (
      <Container>
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            { this.props.t('CHECKOUT_LOGIN_DISCLAIMER') }
          </Text>
        </View>
        <Content padder>
          { this.renderMessage() }
          <AuthenticateForm
            client={ this.props.httpClient }
            onRequestStart={ this.onRequestStart.bind(this) }
            onRequestEnd={ this.onRequestEnd.bind(this) }
            onLoginSuccess={ this.onLoginSuccess.bind(this) }
            onLoginFail={ this.onLoginFail.bind(this) }
            onRegisterSuccess={ this.onLoginSuccess.bind(this) }
            onRegisterFail={ this.onLoginFail.bind(this) } />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    alignItems: 'center',
    padding: 20
  }
})

function mapStateToProps(state, ownProps) {
  return {
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: user => dispatch(login(user)),
    setLoading: isLoading => dispatch(setLoading(isLoading)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Login))
