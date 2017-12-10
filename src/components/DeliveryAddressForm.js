import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base'
import _ from 'underscore'

export default class DeliveryAddressForm extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    const errors = this.props.errors || []

    const postalCodeProps = _.contains(errors, 'postalCode') ? { error: true } : {}

    return (
      <Form>
        <Item stackedLabel>
          <Label>Adresse</Label>
          <Input value={ this.props.deliveryAddress.streetAddress } />
        </Item>
        <Item stackedLabel { ...postalCodeProps}>
          <Label>Code postal</Label>
          <Input value={ this.props.deliveryAddress.postalCode } />
        </Item>
        <Item stackedLabel last>
          <Label>Ville</Label>
          <Input value={ this.props.deliveryAddress.addressLocality } />
        </Item>
      </Form>
    );
  }
}
