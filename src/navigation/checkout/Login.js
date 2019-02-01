import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Content, Text, Button, Icon } from 'native-base'
import { StackActions } from 'react-navigation'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import AuthenticateForm from '../../components/AuthenticateForm'

class Login extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated && true === this.props.isAuthenticated) {
      this.props.navigation.dispatch(StackActions.pop({ n: 1 }))
      this.props.navigation.navigate('CartAddress')
    }
  }

  renderMessage() {
    if (this.props.message) {

      return (
        <View style={ styles.message }>
          <Text style={{ textAlign: 'center' }}>{ this.props.message }</Text>
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
          <AuthenticateForm navigateAfterLogin={ false } />
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

function mapStateToProps(state) {

  return {
    message: state.app.lastAuthenticationError,
    isAuthenticated: state.app.isAuthenticated,
  }
}

module.exports = connect(mapStateToProps)(translate()(Login))
