import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import _ from 'underscore';

import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Form, Item, Input, Label,
  Card, CardItem,
  Root, Toast, StyleProvider
} from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';

import { NavigationActions, StackNavigator } from 'react-navigation'

import API from './src/API'
import Auth from './src/Auth'

const Routes = require('./src/page');
const AppUser = require('./src/AppUser');
const Settings = require('./src/Settings');
const AppConfig = require('./src/AppConfig');

let Router

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: '#e4022d',
  },
  headerBackTitleStyle: {
    color: '#fff',
  },
  headerTitleStyle: {
    color: '#fff',
    // fontWeight needs to be defined or it doesn't work
    // @see https://github.com/react-community/react-navigation/issues/542#issuecomment-345289122
    fontWeight: 'normal',
    fontFamily: 'Raleway-Regular',
  }
}

const routeConfigs = {
  Home: {
    screen: Routes.RestaurantsPage,
    navigationOptions: ({ navigation }) => {

      const { navigate, state, setParams } = navigation
      const { baseURL, client, user } = state.params

      let headerLeft, headerRight

      if (user && user.isAuthenticated()) {
        headerLeft = (
          <Button transparent onPress={ () => navigate('Account', { baseURL, client, user }) }>
            <Icon name="ios-menu" style={{ color: '#fff' }} />
          </Button>
        )
      } else {
        headerLeft = (
          <Button transparent onPress={ () => navigate('Login', { baseURL, client, user }) }>
            <Icon name="log-in" style={{ color: '#fff' }} />
          </Button>
        )
      }

      if (user && user.isAuthenticated() && (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN'))) {
        headerRight = (
          <Button transparent onPress={ () => navigate('Courier', { baseURL, client, user, connected: false, tracking: false }) }>
            <Icon name="ios-bicycle" style={{ color: '#fff' }} />
          </Button>
        )
      } else {
        headerRight = (
          <Button transparent />
        )
      }

      return {
        headerLeft,
        headerRight,
        title: 'Restaurants',
      }
    }
  },
  Account: {
    screen: Routes.AccountPage,
    navigationOptions: ({ navigation }) => {

      const { navigate, state, setParams } = navigation
      const { baseURL, client, user } = state.params

      const logout = () => {

        Auth.removeUser().then(() => {
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

      return {
        headerRight: (
          <Button transparent onPress={ () => logout() }>
            <Icon name="exit" style={{ color: '#fff' }} />
          </Button>
        ),
        title: 'Mon compte',
      }
    }
  },
  AccountAddresses: {
    screen: Routes.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Mes adresses',
    })
  },
  AccountOrders: {
    screen: Routes.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Mes commandes',
    })
  },
  Courier: {
    screen: Routes.CourierPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Livraisons',
    })
  },
  Login: {
    screen: Routes.LoginPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Login',
    })
  },
  Restaurant: {
    screen: Routes.RestaurantPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Restaurant',
    })
  },
  Cart: {
    screen: Routes.CartPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Panier',
    })
  },
  CartAddress: {
    screen: Routes.CartAddressPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Adresse de livraison',
    })
  },
  CreditCard: {
    screen: Routes.CreditCardPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Paiement',
    })
  },
  OrderTracking: {
    screen: Routes.OrderTrackingPage,
    navigationOptions: ({ navigation }) => ({
      title: 'Suivi de commande',
    })
  },
}

export default class App extends Component {

    input = null;

    constructor(props) {
      super(props);
      this.state = {
        client: null,
        initialized: false,
        loading: false,
        settings: {},
        server: null,
        text: '',
        user: null,
        serverError: false,
      }
    }

    componentWillMount() {

      Settings.addListener('server:remove', this.disconnect.bind(this));

      AppUser.load()
        .then(user => {
          Settings
            .loadServer()
            .then(baseURL => this.initializeRouter(baseURL, user))
        })
    }

    initializeRouter(baseURL, user) {
      let client = null;
      if (baseURL) {
        client = API.createClient(baseURL, user);
      }

      const navigatorConfig = {
        initialRouteParams: {
          baseURL,
          client,
          user,
        },
        navigationOptions: {
          ...defaultNavigationOptions
        }
      }

      Router = StackNavigator(routeConfigs, navigatorConfig)

      this.setState({
        client: client,
        initialized: true,
        server: baseURL,
        user: user,
      })
    }

    connect() {
      const server = this.state.text;

      this.setState({ loading: true, serverError: false });

      API.checkServer(server)
        .then(baseURL => {
          const user = this.state.user;
          Settings
            .saveServer(baseURL)
            .then(() => this.initializeRouter(baseURL, user));
        })
        .catch((err) => {

          setTimeout(() => {

            let message = 'Veuillez réessayer plus tard';
            let serverError = false
            if (err.message) {
              if (err.message === 'Network request failed') {
                message = 'Impossible de se connecter';
              }
              if (err.message === 'Not a CoopCycle server') {
                message = 'Ce serveur n\'est pas compatible';
                serverError = true
              }
              if (err.message === 'Hostname is not valid') {
                message = 'Ce serveur n\'est pas valide'
                serverError = true
              }
            }

            Toast.show({
              text: message,
              position: 'bottom',
              type: 'danger',
              duration: 3000
            });

            this.input._root.clear();
            this.input._root.focus();

            this.setState({ loading: false, serverError });

          }, 500);

        });
    }

    disconnect() {
      const user = this.state.user;
      user.logout()

      this.setState({
        client: null,
        server: null,
        user: user,
      });
    }

    renderLoading() {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Chargement</Text>
        </View>
      );
    }

    renderConfigureServer() {

      let loader = (
        <View />
      )
      if (this.state.loading) {
        loader = (
          <View style={styles.loader}>
            <ActivityIndicator
              animating={true}
              size="large"
              color="#fff"
            />
            <Text style={{color: '#fff'}}>Chargement...</Text>
          </View>
        );
      };

      const itemProps = this.state.serverError ? { error: true } : {}

      return (
        <Root>
          <StyleProvider style={getTheme(material)}>
            <Container>
              <Header>
                <Left />
                <Body>
                  <Title>CoopCycle</Title>
                </Body>
                <Right />
              </Header>
              <Content>
                <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                  <Card>
                    <CardItem>
                      <Body>
                        <Text>
                          Veuillez choisir un serveur pour commencer.
                        </Text>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
                <Form style={{ marginVertical: 30 }}>
                  <Item stackedLabel last { ...itemProps }>
                    <Label>Adresse du serveur</Label>
                    <Input
                      ref={(ref) => { this.input = ref }}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      placeholder={'Exemple : demo.coopcycle.org'}
                      onChangeText={(text) => this.setState({ text })} />
                  </Item>
                </Form>
                <View style={{ paddingHorizontal: 10 }}>
                  <Button block onPress={ this.connect.bind(this) }>
                    <Text>Valider</Text>
                  </Button>
                </View>
              </Content>
              { loader }
            </Container>
          </StyleProvider>
        </Root>
      );
    }

    render() {

      if (!this.state.initialized) {
        return this.renderLoading();
      }

      if (!this.state.server) {
        return this.renderConfigureServer();
      }

      return (
        <StyleProvider style={getTheme(material)}>
          <Router />
        </StyleProvider>
      )
    }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
