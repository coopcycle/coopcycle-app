import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import Settings from '../Settings'
import { login } from '../redux/App/actions'

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: '',
      formToDisplay: 'login',
    };
  }

  async resetServer() {

    const { navigation } = this.props.screenProps

    await this.props.user.logout()
    await Settings.removeServer()

    navigation.navigate('ConfigureServer')
  }

  async logout() {

    const { navigation } = this.props.screenProps

    await this.props.user.logout()

    navigation.navigate({
      routeName: 'Home',
      key: 'Home',
      params: {}
    })
  }

  onRequestStart() {
    this.setState({
      message: '',
      loading: true
    })
  }

  onRequestEnd() {
    this.setState({ loading: false })
  }

  async onLoginSuccess(user) {

    const { navigation } = this.props.screenProps

    this.props.login(user)

    navigation.navigate({
      routeName: 'Home',
      key: 'Home',
      params: {}
    })
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

  renderLoader() {
    if (this.state.loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
        </View>
      )
    }

    return (
      <View />
    )
  }

  renderAuthenticated() {

    const { navigate } = this.props.screenProps.navigation

    return (
      <Container>
        <Content style={ styles.content }>
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
          <View style={{ paddingHorizontal: 10, marginTop: 40 }}>
            <Button block danger onPress={ () => this.logout() }>
              <Text>{this.props.t('SIGN_OUT')}</Text>
            </Button>
          </View>
        </Content>
        { this.renderLoader() }
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

    if (this.props.user.isAuthenticated()) {
      return this.renderAuthenticated()
    }

    return (
      <Container>
        <Content style={ styles.content }>
          { this.renderServer() }
          { this.renderMessage() }
          { this.renderForm() }
          <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
            <Button block onPress={() => this.setState({ formToDisplay: alternateForm, message: '' })}>
              <Text>{this.props.t(btnLabel)}</Text>
            </Button>
          </View>
          {/* This empty view is for increasing the page height so the button appears above the menu bar */}
          <View style={styles.message} />
        </Content>
        { this.renderLoader() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 30
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  message: {
    alignItems: "center",
    padding: 20
  }
});

function mapStateToProps(state) {
  return {
    baseURL: state.app.baseURL,
    user: state.app.user,
    httpClient: state.app.httpClient
  }
}

function mapDispatchToProps (dispatch) {
  return {
    login: user => dispatch(login(user)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(AccountPage))
