import React, { Component } from 'react'
import { Dimensions, StyleSheet, PixelRatio, View } from 'react-native'
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

const typeaheadStyles = {
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 7.5,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    marginTop: 0,
    marginLeft: 15,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#333333',
    flex: 1
  },
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
  },
  typeaheadContainer: {
    marginTop: 15
  },
  typeaheadIconContainer: {
    position: 'absolute',
    right: 0,
    height: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginRight: 8
  }
});

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

  _onAddressChange(value) {

    const { address } = this.props

    const newAddress = {
      ...address,
      ...value
    }

    this.props.setAddress(newAddress)
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

    return address && address.streetAddress && address.geo
      && address.hasOwnProperty('isPrecise') && address.isPrecise
  }

  renderAddressForm() {

    const { width } = Dimensions.get('window')
    const { address } = this.props
    const isValid = this._isAddressValid()
    const iconContainerWidth = width * 0.15
    const iconName = isValid ? 'checkmark-circle' : 'close-circle'
    const iconColor = isValid ? '#2ECC71' : '#E74C3C'

    const typeaheadStylesWithPadding = {
      ...typeaheadStyles,
      textInputContainer: {
        ...typeaheadStyles.textInputContainer,
        paddingRight: iconContainerWidth
      }
    }

    return (
      <Form>
        <View>
          <View style={ styles.typeaheadContainer }>
            <AddressTypeahead
              style={ typeaheadStylesWithPadding }
              value={ address && address.streetAddress }
              onPress={ this._onAddressChange.bind(this) } />
          </View>
          <View style={ [ styles.typeaheadIconContainer, { width: iconContainerWidth } ] }>
            <Icon name={ iconName } style={{ color: iconColor }} />
          </View>
        </View>
        <Item stackedLabel>
          <Label style={{ marginBottom: 10 }}>{ this.props.t('ADDRESS_DESCRIPTION') }</Label>
          <Input
            multiline
            onChangeText={ this._onDescriptionChange.bind(this) }
            defaultValue={ address && address.description }
            placeholder={ this.props.t('ADDRESS_DESCRIPTION_PLACEHOLDER') }
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
    const enabled = this._isAddressValid()
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
        <CartFooter onSubmit={ () => navigate('CreditCard') } enabled={ enabled }  />
      </Container>
    );
  }
}

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
