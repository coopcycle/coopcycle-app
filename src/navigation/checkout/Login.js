import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Content, Text, Radio, Right, Left, Footer, FooterTab, Button, Icon } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { incrementItem, decrementItem } from '../../redux/Checkout/actions'
import { login } from '../../redux/App/actions'

import Modal from '../restaurant/components/Modal'
import LoginForm from '../../components/LoginForm'
import LoaderOverlay from '../../components/LoaderOverlay'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  async onLoginSuccess(user) {
    this.props.login(user)
    this.props.navigation.goBack()
    this.props.navigation.navigate('CartAddress')
  }

  onLoginFail(message) {
    console.log('onLoginFail', message)
  }

  render() {

    return (
      <Modal
        navigation={ this.props.navigation }
        title={ this.props.t('CHECKOUT_LOGIN_TITLE') }>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('CHECKOUT_LOGIN_DISCLAIMER') }
          </Text>
        </View>
        <Content padder>
          <LoginForm
            client={ this.props.httpClient }
            onRequestStart={ () => this.setState({ loading: true }) }
            onRequestEnd={ () => this.setState({ loading: false }) }
            onLoginSuccess={ this.onLoginSuccess.bind(this) }
            onLoginFail={ this.onLoginFail.bind(this) } />
        </Content>
        <LoaderOverlay loading={ this.state.loading } />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({

})

function mapStateToProps(state, ownProps) {
  return {
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: user => dispatch(login(user)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Login))
