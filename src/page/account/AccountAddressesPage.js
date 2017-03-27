import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, FooterTab, Button, Icon, List, ListItem, Text
} from 'native-base';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';

import theme from '../../theme/coopcycle';

const AppConfig = require('../../AppConfig');
const AppUser = require('../../AppUser');

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Adresses</Title>
          </Body>
          <Right />
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