import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content, Body,
  Button, Icon, Text,
  Card, CardItem,
  Form, Item, Label, Input, Textarea
} from 'native-base'
import MapView from 'react-native-maps'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import CartFooter from './components/CartFooter'
import AddressTypeahead from '../../components/AddressTypeahead'
import { setAddress } from '../../redux/Checkout/actions'

class CartAddressPage extends Component {

  map = null

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(true), 1000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address && this.props.address.geo) {
      setTimeout(() => this.map.fitToElements(true), 1000);
    }
  }

  _onAddressChange(address) {
    this.props.setAddress(address)
  }

  _onDescriptionChange(description) {

    const { address } = this.props

    const newAddress = {
      ...address,
      description
    }

    this.props.setAddress(newAddress)
  }

  _isAddressValid() {

    const { address } = this.props

    return address && address.streetAddress && address.geo && address.hasOwnProperty('isPrecise') && address.isPrecise
  }

  renderAddressForm() {

    const { address } = this.props
    const itemProps = address && address.isPrecise ? { success: true } : { error: true }

    return (
      <Form>
        <AddressTypeahead onPress={ this._onAddressChange.bind(this) } />
        <Item stackedLabel style={{ marginBottom: 15 }} { ...itemProps }>
          <Label>{ this.props.t('ADDRESS') }</Label>
          <Input
            editable={ false }
            value={ address ? address.streetAddress : '' } />
        </Item>
        <Item stackedLabel>
          <Label style={{ marginBottom: 10 }}>{ this.props.t('ADDRESS_DESCRIPTION') }</Label>
          <Input
            multiline
            onChangeText={ this._onDescriptionChange.bind(this) }
            style={{ height: 5 * 25 }} />
        </Item>

      </Form>
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

    const { navigate } = this.props.navigation
    const { address } = this.props

    const markers = []

    if (address && address.geo) {
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
        <CartFooter onSubmit={ () => navigate('CreditCard') } enabled={ this._isAddressValid() }  />
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
