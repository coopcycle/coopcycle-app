import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base'

export default class DeliveryAddressForm extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Form>
        <Item stackedLabel>
          <Label>Adresse</Label>
          <Input value={ this.props.deliveryAddress.streetAddress } />
        </Item>
        <Item stackedLabel last>
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
