import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
} from 'react-native';
import {
  Container,
  Header,
  Title, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';

import { API } from 'coopcycle-js';
import theme from '../theme/coopcycle';

const AppConfig = require('../AppConfig');
const AppUser = require('../AppUser');
const APIClient = null;

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        APIClient = API.createClient(AppConfig.API_BASEURL, user);
      });
  }
  _renderRow(item) {
    return (
      <ListItem>
        <Text>{item.streetAddress}</Text>
      </ListItem>
    );
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    return (
      <Container theme={ theme }>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Adresses</Title>
        </Header>
        <Content>
          <List dataArray={ this.props.user.deliveryAddresses } renderRow={ this._renderRow.bind(this) } />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

})

module.exports = AccountAddressesPage;