import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  Badge,
  Container,
  Header, Title, Content, Footer,
  Left, Right,
  Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import MapView from 'react-native-maps'
import { translate } from 'react-i18next'
import DeliveryAddressForm from '../components/DeliveryAddressForm'

class CartAddressPage extends Component {

  deliveryAddressForm = null
  map = null

  constructor(props) {
    super(props);

    const { deliveryAddress } = this.props.navigation.state.params

    this.state = {
      deliveryAddresses: [],
      deliveryAddress,
      loading: false,
      loaded: false,
      errors: []
    };
  }

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }

  createAddress() {

    const { navigate } = this.props.navigation
    const { cart, client, user } = this.props.navigation.state.params

    this.setState({ loading: true })

    const { deliveryAddress } = this.state
    Object.assign(deliveryAddress, this.deliveryAddressForm.getWrappedInstance().createDeliveryAddress())

    client.post('/api/me/addresses', deliveryAddress)
      .then(data => {

        cart.setDeliveryAddress(data)

        this.setState({
          deliveryAddress: data,
          loading: false,
        })

        navigate('CreditCard', { cart, deliveryAddress: data, client, user })
      })
      .catch(err => {
        if (err.hasOwnProperty('@type') && err['@type'] === 'ConstraintViolationList') {
          const { violations } = err
          const errors = violations.map(violation => violation.propertyPath)
          this.setState({ errors })
        }
      })
  }

  render() {

    const { deliveryAddress, errors } = this.state
    const markers = [{
      key: 'deliveryAddress',
      identifier: 'deliveryAddress',
      coordinate: deliveryAddress.geo,
      pinColor: 'green',
    }]

    return (
      <Container>
        <Content>
          <View style={{ height: 200 }}>
            <MapView
              ref={ component => this.map = component }
              style={ styles.map }
              zoomEnabled
              loadingEnabled
              loadingIndicatorColor={ '#666666' }
              loadingBackgroundColor={ '#eeeeee' }>
              {markers.map(marker => (
                <MapView.Marker
                  identifier={ marker.identifier }
                  key={ marker.key }
                  coordinate={ marker.coordinate }
                  pinColor={ marker.pinColor }
                  title={ marker.title }
                  description={ marker.description } />
              ))}
            </MapView>
          </View>
          <DeliveryAddressForm ref={ component => this.deliveryAddressForm = component } { ...deliveryAddress } errors={ errors } />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Button block onPress={ () => this.createAddress() }>
              <Text>{this.props.t('CONTINUE')}</Text>
            </Button>
          </View>
          <View style={styles.loader}>
            <ActivityIndicator
              animating={this.state.loading}
              size="large"
              color="#0000ff"
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

module.exports = translate()(CartAddressPage);
