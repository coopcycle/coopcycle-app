import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  ActivityIndicator,
} from 'react-native';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';
import { API } from 'coopcycle-js';

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

    console.log(props.cart);

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
  _onClick() {
    if (this.state.valid) {
      Stripe.createTokenWithCard(this.state.params)
        .then((token) => {
          console.log('Token created!', token.tokenId);

          // { livemode: false,
          // created: 1485727859,
          // card:
          //  { cardId: 'card_19hQsxGWzUDul81alL171eiG',
          //    funding: 'credit',
          //    country: 'US',
          //    expMonth: 12,
          //    brand: 'Visa',
          //    last4: '4242',
          //    expYear: 2018 },
          // tokenId: 'tok_19hQsxGWzUDul81aFuSKd20P' }

          APIClient.request('POST', '/api/orders', this.props.cart.toJSON())
            .then((order) => {
              console.log('Order created!', order);

              return APIClient.request('PUT', order['@id'] + '/pay', {
                stripeToken: token.tokenId
              });
            })
            .then((order) => {
              console.log('Order paid!', order);
            });

        })
    }
    // { number: '4242424242424242',
    // expYear: 18,
    // expMonth: 12,
    // cvc: '1' }
  }
  render() {
    return (
      <Navigator
          renderScene={this.renderScene.bind(this)}
          navigator={this.props.navigator}
          navigationBar={
            <Navigator.NavigationBar style={{backgroundColor: '#246dd5'}}
                routeMapper={NavigationBarRouteMapper} />
          } />
    );
  }
  renderScene(route, navigator) {
    return (
      <View style={styles.container}>
        <PaymentCardTextField
            accessible
            accessibilityLabel="cardTextField"
            style={styles.field}
            onParamsChange={(valid, params) => {
              this.setState({
                valid: valid,
                params: params
              });
            }}
          />
        <TouchableOpacity style={styles.button} onPress={this._onClick.bind(this)}>
          <Text>Payer</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}
          onPress={() => navigator.parentNavigator.pop()}>
        <Text style={{color: 'white', margin: 10,}}>Retour</Text>
      </TouchableOpacity>
    );
  },
  RightButton(route, navigator, index, navState) {
    return null;
  },
  Title(route, navigator, index, navState) {
    return (
      <TouchableOpacity style={{flex: 1, justifyContent: 'center'}}>
        <Text style={{color: 'white', margin: 10, fontSize: 16}}>
          Panier
        </Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#246dd5",
    padding: 20,
    marginTop: 20,
    borderRadius: 4
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