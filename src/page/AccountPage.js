import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';

import { NavigationActions } from 'react-navigation'

import LoginForm from '../components/LoginForm'
import Settings from '../Settings'

class AccountPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      message: ''
    };
  }

  logout() {

    const { baseURL, client, user, navigation } = this.props.screenProps

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
        <Text style={{ textAlign: 'center' }}>Connecté à <Text style={{ fontWeight: 'bold' }}>{ baseURL }</Text></Text>
        <Button block transparent onPress={ () => Settings.removeServer() }>
          <Text>Choisir un autre serveur</Text>
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
          <Text style={{color: '#fff'}}>Chargement...</Text>
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
              Bonjour { user.username }
            </Text>
          </View>
          <List>
            <ListItem button iconRight onPress={ () => navigate('AccountDetails', { client }) }>
              <Body>
                <Text>Informations personnelles</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountAddresses', { client }) }>
              <Body>
                <Text>Adresses</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountOrders', { client }) }>
              <Body>
                <Text>Commandes</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <View style={{ paddingHorizontal: 10, marginTop: 40 }}>
            <Button block danger onPress={ () => this.logout() }>
              <Text>Déconnexion</Text>
            </Button>
          </View>
        </Content>
        { this.renderLoader() }
      </Container>
    )
  }

  render() {

    const { navigate } = this.props.navigation
    const { baseURL, client, user } = this.props.screenProps
    const isAuthenticated = user && user.isAuthenticated()

    if (isAuthenticated) {
      return this.renderAuthenticated()
    }

    return (
      <Container>
        <Content style={ styles.content }>
          { this.renderServer() }
          <LoginForm
            client={ client }
            onRequestStart={ this.onRequestStart.bind(this) }
            onRequestEnd={ this.onRequestEnd.bind(this) }
            onLoginSuccess={ this.onLoginSuccess.bind(this) }
            onLoginFail={ this.onLoginFail.bind(this) } />
          <View style={ styles.message }>
            <Text style={{ textAlign: 'center' }}>{this.state.message}</Text>
          </View>
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

module.exports = AccountPage;