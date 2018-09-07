import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Badge,
  Container,
  Header, Title, Content, Footer,
  Left, Right,
  Button, Icon, List, ListItem, Text, Radio } from 'native-base';
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import DeliveryAddressForm from '../components/DeliveryAddressForm'
import LoaderOverlay from '../components/LoaderOverlay'
import { setAddressResource } from '../redux/Checkout/actions'

class CartAddressPage extends Component {

  deliveryAddressForm = null
  map = null

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: []
    };
  }

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }

  createAddress() {

    const { navigate } = this.props.navigation

    const { deliveryAddress } = this.props
    Object.assign(deliveryAddress, this.deliveryAddressForm.getWrappedInstance().createDeliveryAddress())

    this.setState({ loading: true })

    this.props.httpClient
      .post('/api/me/addresses', deliveryAddress)
      .then(data => {

        this.setState({ loading: false })
        this.props.setAddress(data)

        navigate('CreditCard')
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

    const { errors } = this.state
    const { deliveryAddress } = this.props
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
        </Content>
        <LoaderOverlay loading={ this.state.loading } />
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

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    deliveryAddress: state.checkout.address
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setAddress: address => dispatch(setAddressResource(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(CartAddressPage))
