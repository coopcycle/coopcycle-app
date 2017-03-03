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

const CONF = require('../AppConfig.json');

Stripe.init({
  publishableKey: CONF.STRIPE_PUBLISHABLE_KEY,
});

class CreditCardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      params: {}
    };
  }
  componentDidMount() {
    AppUser.load()
      .then((user) => {
        APIClient = API.createClient(AppConfig.API_BASEURL, user);
      });
  }
  _onClick(navigator) {
    if (this.state.valid) {
      Stripe.createTokenWithCard(this.state.params)
        .then((token) => {
          APIClient.request('POST', '/api/orders', this.props.cart.toJSON())
            .then((order) => {
              return APIClient.request('PUT', order['@id'] + '/pay', {
                stripeToken: token.tokenId
              });
            })
            .then((order) => {
              navigator.parentNavigator.push({
                id: 'OrderTrackingPage',
                name: 'OrderTracking',
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                passProps: {
                  order: order
                }
              });
            });
        })
    }
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator} />
    );
  }
  renderScene(route, navigator) {
    let btnText = 'Payer 0 €';
    if (this.props.cart) {
      btnText = 'Payer ' + this.props.cart.total + ' €';
    }
    return (
      <Container theme={theme}>
        <Header>
          <Button transparent onPress={() => navigator.parentNavigator.pop()}>
            <Icon name="ios-arrow-back" />
          </Button>
          <Title>Paiement</Title>
        </Header>
        <Content padder contentContainerStyle={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <Text style={ styles.padder }>Veuillez entrer vos coordonnées bancaires</Text>
          <PaymentCardTextField
            accessible
            accessibilityLabel="cardTextField"
            style={ styles.field }
            onParamsChange={(valid, params) => {
              this.setState({
                valid: valid,
                params: params
              });
            }}
          />

        </Content>
        <Footer>
          <Button
            style={{ alignSelf: "flex-end", marginRight: 10 }}
            onPress={ this._onClick.bind(this, navigator) }>{ btnText }</Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padder: {
    padding: 10
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  params: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: 300,
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
})

module.exports = CreditCardPage;