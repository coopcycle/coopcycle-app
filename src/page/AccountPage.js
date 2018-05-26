import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';

import { NavigationActions } from 'react-navigation'
import { translate } from 'react-i18next'

import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import { Settings, events } from '../Settings'

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: '',
      formToDisplay: 'login',
    };
  }

  logout() {

    const { baseURL, client, user, navigation } = this.props.screenProps

    events.emit('user:logout')

    user.logout()
      .then(() => {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
              params: {
                baseURL,
                client,
                user: null
              }
            })
          ]
        })
        navigation.dispatch(resetAction)
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

  onLoginSuccess(user) {

    const { baseURL, client, navigation } = this.props.screenProps

    events.emit('user:login', { baseURL, client, user })

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: {
            baseURL,
            client,
            user
          }
        })
      ]
    })
    navigation.dispatch(resetAction)
  }

  onLoginFail(message) {
    this.setState({ message })
  }

  renderServer() {
    const { baseURL } = this.props.screenProps

    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ textAlign: 'center' }}>
          {
            [
              this.props.t('CONNECTED_TO'),
              ' ',
              <Text key={3} style={{ fontWeight: 'bold' }}>{baseURL}</Text>
            ]
          }
        </Text>
        <Button block transparent onPress={ () => Settings.removeServer() }>
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

    const { baseURL, client, user } = this.props.screenProps
    const { navigate } = this.props.screenProps.navigation

    return (
      <Container>
        <Content style={ styles.content }>
          { this.renderServer() }
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Icon name="person" />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {`${this.props.t('HELLO')} ${ user.username }`}
            </Text>
          </View>
          <List>
            <ListItem button iconRight onPress={ () => navigate('AccountDetails', { client }) }>
              <Body>
                <Text>{this.props.t('DETAILS')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountAddresses', { client }) }>
              <Body>
                <Text>{this.props.t('ADDRESSES')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountOrders', { client }) }>
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
    const { client } = this.props.screenProps
    const { formToDisplay } = this.state

    if (this.state.formToDisplay === 'login') {
      return (
        <LoginForm
          client={client}
          onRequestStart={this.onRequestStart.bind(this)}
          onRequestEnd={this.onRequestEnd.bind(this)}
          onLoginSuccess={this.onLoginSuccess.bind(this)}
          onLoginFail={this.onLoginFail.bind(this)} />
      )
    }

    if (this.state.formToDisplay === 'register') {
      return (
        <RegisterForm
          client={client}
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

    const { navigate } = this.props.navigation
    const { baseURL, client, user } = this.props.screenProps
    const isAuthenticated = user && user.isAuthenticated()
    const alternateForm = this.state.formToDisplay === 'login' ? 'register' : 'login'
    const btnLabel = this.state.formToDisplay === 'login' ? 'OR_REGISTER' : 'OR_LOGIN'

    if (isAuthenticated) {
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

module.exports = translate()(AccountPage);
