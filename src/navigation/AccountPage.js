import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Settings from '../Settings'
import { login, setLoading } from '../redux/App/actions'

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      isAuthenticated: this.props.user.isAuthenticated(),
      formToDisplay: 'login',
    };
  }

  async resetServer() {

    const { navigate } = this.props.navigation

    await this.props.user.logout()
    await Settings.removeServer()

    this.setState({ isAuthenticated: this.props.user.isAuthenticated() })

    navigate('ConfigureServer')
  }

  async logout() {

    await this.props.user.logout()

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'AccountHome' }),
      ]
    })
    this.props.navigation.dispatch(resetAction)
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

  onLoginSuccess(user) {
    this.props.login(user)
    this.setState({ isAuthenticated: true })
  }

  onLoginFail(message) {
    this.setState({ message })
  }

  renderServer() {
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ textAlign: 'center' }}>
          {
            [
              this.props.t('CONNECTED_TO'),
              ' ',
              <Text key={3} style={{ fontWeight: 'bold' }}>{ this.props.baseURL }</Text>
            ]
          }
        </Text>
        <Button block transparent onPress={ this.resetServer.bind(this) }>
          <Text>{this.props.t('CHANGE_SERVER')}</Text>
        </Button>
      </View>
    )
  }

  renderAuthenticated() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content padder>
          { this.renderServer() }
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Icon name="person" />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {`${this.props.t('HELLO')} ${ this.props.user.username }`}
            </Text>
          </View>
          <List>
            <ListItem button iconRight onPress={ () => navigate('AccountDetails') }>
              <Body>
                <Text>{this.props.t('DETAILS')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountAddresses') }>
              <Body>
                <Text>{this.props.t('ADDRESSES')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountOrders') }>
              <Body>
                <Text>{this.props.t('ORDERS')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <View style={{ marginTop: 40, marginBottom: 60 }}>
            <Button block danger onPress={ () => this.logout() }>
              <Text>{this.props.t('SIGN_OUT')}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }

  renderForm() {
    const { formToDisplay } = this.state

    if (this.state.formToDisplay === 'login') {
      return (
        <LoginForm
          client={this.props.httpClient}
          onRequestStart={this.onRequestStart.bind(this)}
          onRequestEnd={this.onRequestEnd.bind(this)}
          onLoginSuccess={this.onLoginSuccess.bind(this)}
          onLoginFail={this.onLoginFail.bind(this)} />
      )
    }

    if (this.state.formToDisplay === 'register') {
      return (
        <RegisterForm
          client={this.props.httpClient}
          onRequestStart={this.onRequestStart.bind(this)}
          onRequestEnd={this.onRequestEnd.bind(this)}
          onRegisterSuccess={this.onLoginSuccess.bind(this)} // TODO: Using the same actions as for Login...is that OK?
          onRegisterFail={this.onLoginFail.bind(this)} />    // TODO: Using the same actions as for Login...is that OK?
      )
    }
  }

  renderMessage() {
    if (this.state.message) {
      return (
        <View style={styles.message}>
          <Text style={{ textAlign: 'center' }}>{this.state.message}</Text>
        </View>
      )
    }
  }

  render() {

    const alternateForm = this.state.formToDisplay === 'login' ? 'register' : 'login'
    const btnLabel = this.state.formToDisplay === 'login' ? 'OR_REGISTER' : 'OR_LOGIN'

    if (this.state.isAuthenticated) {
      return this.renderAuthenticated()
    }

    return (
      <Container>
        <Content padder>
          { this.renderServer() }
          { this.renderMessage() }
          { this.renderForm() }
          <View style={{ marginTop: 10 }}>
            <Button block transparent onPress={() => this.setState({ formToDisplay: alternateForm, message: '' })}>
              <Text>{this.props.t(btnLabel)}</Text>
            </Button>
          </View>
          {/* This empty view is for increasing the page height so the button appears above the menu bar */}
          <View style={styles.message} />
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
});

function mapStateToProps(state) {
  return {
    baseURL: state.app.baseURL,
    user: state.app.user,
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    login: user => dispatch(login(user)),
    setLoading: isLoading => dispatch(setLoading(isLoading)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(AccountPage))
