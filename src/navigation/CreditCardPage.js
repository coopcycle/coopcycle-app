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
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Settings } from '../Settings'
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
    Stripe.init({
      publishableKey: Settings.get('stripe_publishable_key'),
    });
  }
  _onClick() {

    const { cart } = this.props.navigation.state.params

    if (this.state.valid) {
      this.setState({ loading: true });
      Stripe.createTokenWithCard(this.state.params)
        .then(token => {
          this.props.httpClient.post('/api/orders', cart.toJSON())
            .then(order => {
              return this.props.httpClient.put(order['@id'] + '/pay', {
                stripeToken: token.tokenId
              });
            })
            .then(order => {
              this.setState({ loading: false });
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'OrderTracking',
                    params: { order }
                  })
                ]
              })
              this.props.navigation.dispatch(resetAction)
            })
            .catch(err => console.log(err));
        })
    }
  }
  render() {
    const { height, width } = Dimensions.get('window')
    const { cart } = this.props.navigation.state.params

    const btnText = `Payer ${formatPrice(cart.total)} €`;

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
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
        </View>
      );
      btnProps = { disabled: true }
    }

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

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient
  }
}

module.exports = connect(mapStateToProps)(translate()(CreditCardPage))
