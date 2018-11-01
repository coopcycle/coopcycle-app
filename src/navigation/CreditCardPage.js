import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {
  Container,
  Header, Title, Content, Footer,
  Left, Right, Body,
  Button, Icon, List, ListItem, Text, Radio
} from 'native-base';
import Stripe, { PaymentCardTextField } from 'tipsi-stripe';
import { StackActions, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import LoaderOverlay from '../components/LoaderOverlay'
import { clear } from '../redux/Checkout/actions'
import Settings from '../Settings'
import { formatPrice } from '../Cart'

class CreditCardPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      loading: false,
      params: {}
    };
  }

  componentDidMount() {
    Stripe.setOptions({
      publishableKey: Settings.get('stripe_publishable_key'),
    });
  }

  _onClick() {

    const { cart } = this.props

    if (this.state.valid) {

      this.setState({ loading: true });

      Stripe.createTokenWithCard(this.state.params)
        .then(token => {

          const newCart = cart.clone()
          newCart.setDeliveryAddress(this.props.address)
          newCart.setDeliveryDate(this.props.date)

          this.props.httpClient
            .post('/api/orders', newCart.toJSON())
            .then(order => {
              return this.props.httpClient
                .put(order['@id'] + '/pay', {
                  stripeToken: token.tokenId
                });
            })
            .then(order => {
              this.setState({ loading: false });

              // @see https://reactnavigation.org/docs/en/stack-actions.html
              const resetAction = StackActions.reset({
                index: 2,
                actions: [
                  NavigationActions.navigate({ routeName: 'AccountHome' }),
                  NavigationActions.navigate({ routeName: 'AccountOrders' }),
                  NavigationActions.navigate({ routeName: 'OrderTracking', params: { order } }),
                ]
              })
              this.props.navigation.dispatch(resetAction)

              // Make sure to call clear AFTER navigation has been reset
              this.props.clear()
            })
            .catch(err => console.log(err));
        })
    }
  }

  render() {
    const { height, width } = Dimensions.get('window')
    const { cart } = this.props

    const btnText = `Payer ${formatPrice(cart.total)} €`;
    const btnProps = this.state.loading ? { disabled: true } : {}

    const cardStyle =  {
      width: (width - 40),
      color: '#449aeb',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 5,
    }

    return (
      <Container>
        <Content padder contentContainerStyle={ { flex: 1, justifyContent: 'center', alignItems: 'center' } }>
          <Text style={{ marginBottom: 10 }}>{this.props.t('ENTER_PAY_DETAILS')}</Text>
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
              onPress={ this._onClick.bind(this) }
              {...btnProps}><Text>{ btnText }</Text></Button>
          </Right>
        </Footer>
        <LoaderOverlay loading={ this.state.loading } />
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

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    cart: state.checkout.cart,
    address: state.checkout.addressResource,
    date: state.checkout.date,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clear: () => dispatch(clear()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(CreditCardPage))
