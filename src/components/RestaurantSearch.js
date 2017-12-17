import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'

import AddressTypeahead from './AddressTypeahead'
import DateTimePicker from './DateTimePicker'

const dateTimePickerWidth = 100

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    paddingRight: dateTimePickerWidth
  },
  right: {
    backgroundColor: '#e4022d',
    position: 'absolute',
    right: 0,
    height: 44,
    width: dateTimePickerWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class RestaurantSearch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      deliveryAddress: null,
      deliveryDate: null
    }
  }

  onDeliveryAddressChange(deliveryAddress) {

    const { deliveryDate } = this.state

    this.setState({ deliveryAddress })
    this.props.onChange(deliveryAddress, deliveryDate)
  }

  onDeliveryDateChange(deliveryDate) {

    const { deliveryAddress } = this.state

    this.setState({ deliveryDate })
    this.props.onChange(deliveryAddress, deliveryDate)
  }

  resetDeliveryDate() {
    this.dateTimePicker.reset()
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.left }>
          <AddressTypeahead onPress={ this.onDeliveryAddressChange.bind(this) } />
        </View>
        <View style={ styles.right }>
          <DateTimePicker
            ref={ component => this.dateTimePicker = component }
            onChange={ this.onDeliveryDateChange.bind(this) } />
        </View>
      </View>
    )
  }
}
