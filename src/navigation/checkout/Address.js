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

import CartFooter from './components/CartFooter'
import DeliveryAddressForm from '../../components/DeliveryAddressForm'
import { setAddress } from '../../redux/Checkout/actions'

class CartAddressPage extends Component {

  deliveryAddressForm = null
  map = null

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }

  createAddress() {

    const { navigate } = this.props.navigation

    const { address } = this.props
    const newAddress = Object.assign({}, address, this.deliveryAddressForm.getWrappedInstance().createDeliveryAddress())

    this.props.setAddress(newAddress)
    navigate('CreditCard')
  }

  render() {

    const { address } = this.props

    const markers = []

    if (address) {
      markers.push({
        key: 'deliveryAddress',
        identifier: 'deliveryAddress',
        coordinate: address.geo,
        pinColor: 'green',
      })
    }

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
          <DeliveryAddressForm ref={ component => this.deliveryAddressForm = component } { ...address } />
        </Content>
        <CartFooter onSubmit={ this.createAddress.bind(this) }  />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function mapStateToProps(state) {
  return {
    address: state.checkout.address
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setAddress: address => dispatch(setAddress(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(CartAddressPage))
