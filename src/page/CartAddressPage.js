import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Badge,
  Container,
  Header, Title, Content, Footer,
  Left, Right, Body,
  Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MapView from 'react-native-maps'
import _ from 'underscore';

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
    Object.assign(deliveryAddress, this.deliveryAddressForm.createDeliveryAddress())

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
        const { violations } = err
        const errors = violations.map(violation => violation.propertyPath)
        this.setState({ errors })
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
              <Text>Continuer</Text>
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

module.exports = CartAddressPage;