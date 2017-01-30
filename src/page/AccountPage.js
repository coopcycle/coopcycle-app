import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import { Container, Header, Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import { API } from 'coopcycle-js';

const Auth = require('../Auth');
const AppConfig = require('../AppConfig');
const AppUser = require('../AppUser');
const APIClient = null;

class AccountPage extends Component {
  state = {
    user: {},
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        this.setState({ user });

        APIClient = API.createClient(AppConfig.API_BASEURL, user);
        APIClient.request('GET', '/api/me')
          .then((data) => {
            console.log(data);
          });
      });
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  _onClickButton(navigator) {
    Auth.removeUser().then(() => {
      this.props.onLogout();
      navigator.parentNavigator.pop();
    });
  }
  renderScene(route, navigator) {
    return (
      <Container>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name='ios-close' />
          </Button>
          <Title>Mon compte</Title>
        </Header>
        <Content style={{ paddingTop: 40 }}>
          <View style={{ alignItems: 'center', padding: 10 }}>
            <Text>{this.state.user.username}</Text>
          </View>
          <Button style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }} onPress={ this._onClickButton.bind(this, navigator) }>
            Déconnexion
          </Button>
        </Content>
      </Container>
    );
  }
}

module.exports = AccountPage;