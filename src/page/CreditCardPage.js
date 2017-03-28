import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Navigator,
  ActivityIndicator,
} from 'react-native';
import {
  Container,
  Header, Title, Content, Footer,
  Left, Right, Body,
  Button, Icon, List, ListItem, Text, Radio
} from 'native-base';
import _ from 'underscore';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';

import AppConfig from '../AppConfig'
import theme from '../theme/coopcycle';

Stripe.init({
  publishableKey: AppConfig.STRIPE_PUBLISHABLE_KEY,
});

class CreditCardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      loading: false,
      params: {}
    };
  }
  _onClick(navigator) {
    if (this.state.valid) {
      this.setState({ loading: true });
      Stripe.createTokenWithCard(this.state.params)
        .then((token) => {
          this.props.client.post('/api/orders', this.props.cart.toJSON())
            .then((order) => {
              return this.props.client.put(order['@id'] + '/pay', {
                stripeToken: token.tokenId
              });
            })
            .then((order) => {
              this.setState({ loading: false });
              navigator.parentNavigator.resetTo({
                id: 'OrderTrackingPage',
                name: 'OrderTracking',
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                passProps: {
                  order: order,
                  backButton: false
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

    let loader = (
      <View />
    )
    let btnProps = {}
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
      btnProps = { disabled: true }
    }

    const cardStyle =  {
      // width: 300,
      color: '#449aeb',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 5,
    }

    return (
      <Container theme={theme}>
        <Header>
          <Left>
            <Button transparent onPress={() => navigator.parentNavigator.pop()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Paiement</Title>
          </Body>
          <Right />
        </Header>
        <Content padder contentContainerStyle={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <Text style={ styles.padder }>Veuillez entrer vos coordonnées bancaires</Text>
          <PaymentCardTextField
            accessible
            accessibilityLabel="cardTextField"
            style={ cardStyle }
            onParamsChange={(valid, params) => {
              this.setState({
                valid: valid,
                params: params
              });
            }}
          />
        </Content>
        <Footer>
          <Right>
            <Button
              onPress={ this._onClick.bind(this, navigator) }
              {...btnProps}><Text>{ btnText }</Text></Button>
          </Right>
        </Footer>
        { loader }
      </Container>
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
  padder: {
    padding: 10
  },
})

module.exports = CreditCardPage;