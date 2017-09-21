/**
 * CoopCycle App
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  Navigator,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import _ from 'underscore';

import API from './src/API';

import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Form, Item, Input, Label,
  Card, CardItem,
  Toast
} from 'native-base';

const Routes = require('./src/page');
const AppUser = require('./src/AppUser');
const Settings = require('./src/Settings');
const AppConfig = require('./src/AppConfig');

class coursiersapp extends Component {

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
      error: '',
    }
  }
  componentWillMount() {

    Settings.addListener('server:remove', this.disconnect.bind(this));

    AppUser.load()
      .then((user) => {
        Settings.loadServer()
          .then((baseURL) => {

            let client = null;
            if (baseURL) {
              client = API.createClient(baseURL, user);
            }

            this.setState({
              client: client,
              initialized: true,
              server: baseURL,
              user: user,
            });

          });
      });
  }
  connect() {
    const server = this.state.text;

    this.setState({ loading: true });

    API.checkServer(server)
      .then((baseURL) => {
        const user = this.state.user;

        Settings.saveServer(baseURL)
          .then(() => {
            this.setState({
              client: API.createClient(baseURL, user),
              loading: false,
              server: server
            });
          });
      })
      .catch((err) => {

        setTimeout(() => {

          let message = '';
          if (err.message) {
            if (err.message === 'Network request failed') {
              message = 'Impossible de se connecter';
            }
            if (err.message === 'Not a CoopCycle server') {
              message = 'Ce serveur n\'est pas compatible';
            }

            Toast.show({
              text: message,
              position: 'bottom',
              type: 'danger',
              duration: 3000
            });

          }

          this.input._root.clear();
          this.input._root.focus();

          this.setState({ loading: false });

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
  render() {
    return (
      <Navigator
        initialRoute={{id: 'RestaurantsPage', name: 'Restaurants'}}
        renderScene={this.renderScene.bind(this)}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }} />
    );
  }
  renderScene(route, navigator) {

    if (!this.state.initialized) {
      return this.loading();
    }

    if (!this.state.server) {
      return this.configureServer();
    }

    const routeId = route.id;
    const user = this.state.user;
    const client = this.state.client;
    const server = this.state.server;

    let RouteComponent = Routes[route.id];

    if (Routes.hasOwnProperty(route.id)) {
      return React.createElement(RouteComponent, { client, navigator, server, user, ...route.passProps });
    }

    return this.noRoute(navigator);
  }

  loading() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Chargement</Text>
      </View>
    );
  }

  configureServer() {

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

    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>CoopCycle</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Form style={{ marginBottom: 20 }}>
            <Item stackedLabel last>
              <Label>Serveur</Label>
              <Input ref={(ref) => { this.input = ref }} autoCapitalize={'none'} autoCorrect={false}
                onChangeText={(text) => this.setState({ text })} />
            </Item>
          </Form>
          <View style={{ paddingHorizontal: 10 }}>
            <Button block onPress={this.connect.bind(this)}>
              <Text>Valider</Text>
            </Button>
          </View>
        </Content>
        { loader }
      </Container>
    );
  }

  noRoute(navigator) {
    return (
      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => navigator.pop()}>
          <Text style={{color: 'red', fontWeight: 'bold'}}>NOT FOUND</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
});

AppRegistry.registerComponent('coursiersapp', () => coursiersapp);
