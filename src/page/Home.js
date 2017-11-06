import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail
} from 'native-base';

import theme from '../theme/coopcycle'
import AppConfig from '../AppConfig.json'
import API from '../API';

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
})

const AppUser = require('../AppUser');
const Settings = require('../Settings');
const Restaurants = require('./RestaurantsPage');

class Home extends Component {

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

    if (!this.state.initialized) {
      return this.renderLoading();
    }

    if (!this.state.server) {
      return this.renderConfigureServer();
    }

    const { client, user } = this.state

    return <Restaurants user={ user } client={ client } />
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
}

module.exports = Home;
