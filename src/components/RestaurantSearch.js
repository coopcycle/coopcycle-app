import React, { Component } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'

import AddressTypeahead from './AddressTypeahead'
import DateTimePicker from './DateTimePicker'

const dateTimePickerWidth = 100

const styles = StyleSheet.create({
  container : {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    overflow: 'visible'
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

const typeaheadStyle = {
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInputContainer: {
    backgroundColor: '#e4022d',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    backgroundColor: '#ffffff',
  }
}

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
    this.dateTimePicker.getWrappedInstance().reset()
  }

  render() {

    const { width } = Dimensions.get('window')

    return (
      <View style={ [ styles.container, { width } ] }>
        <View style={{ flex: 1 }}>
          <View style={ [ styles.left, { flex: 1 } ] }>
            <AddressTypeahead style={ typeaheadStyle } onPress={ this.onDeliveryAddressChange.bind(this) } />
          </View>
          <View style={ styles.right }>
            <DateTimePicker
              ref={ component => this.dateTimePicker = component }
              onChange={ this.onDeliveryDateChange.bind(this) } />
          </View>
        </View>
      </View>
    )
  }
}
