import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container,
  Content, Button, Icon, List, ListItem, Text
} from 'native-base';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';

import theme from '../../theme/coopcycle';

const AppUser = require('../../AppUser');

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  _renderRow(item) {
    return (
      <ListItem>
        <Text>{ item.streetAddress }</Text>
      </ListItem>
    );
  }
  render() {

    const { addresses } = this.props.navigation.state.params

    return (
      <Container theme={ theme }>
        <Content>
          <List dataArray={ addresses } renderRow={ this._renderRow.bind(this) } />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

})

module.exports = AccountAddressesPage;