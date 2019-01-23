import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content, Body,
  Button, Icon, Text,
  Card, CardItem
} from 'native-base'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import CartFooter from './components/CartFooter'
import DeliveryAddressForm from '../../components/DeliveryAddressForm'
import AddressTypeahead from '../../components/AddressTypeahead'
import { setAddress } from '../../redux/Checkout/actions'

class CartAddressPage extends Component {

  deliveryAddressForm = null
  map = null

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      setTimeout(() => this.map.fitToElements(true), 1000);
    }
  }

  createAddress() {

    const { navigate } = this.props.navigation

    const { address } = this.props
    const newAddress = Object.assign({}, address, this.deliveryAddressForm.getWrappedInstance().createDeliveryAddress())

    this.props.setAddress(newAddress)
    navigate('CreditCard')
  }

  _onAddressChange(address) {
    this.props.setAddress(address)
  }

  renderAddressForm() {

    const { address } = this.props

    if (!address || !address.isPrecise) {

      return (
        <AddressTypeahead onPress={ this._onAddressChange.bind(this) } />
      )
    }

    return (
      <DeliveryAddressForm
        ref={ component => this.deliveryAddressForm = component }
        { ...address } />
    )
  }

  renderAlert() {

    const { address } = this.props

    if (address && !address.isPrecise) {

      return (
        <View style={ styles.alertContainer }>
          <Text style={ styles.alertText }>
            { this.props.t('ADDRESS_NOT_PRECISE_ENOUGH') }
          </Text>
        </View>
      )
    }
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
          { this.renderAlert() }
          { this.renderAddressForm() }
        </Content>
        <CartFooter onSubmit={ this.createAddress.bind(this) } enabled={ address ? true : false }  />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    backgroundColor: '#f2dede',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  alertText: {
    color: '#a94442',
    textAlign: 'center',
  }
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
