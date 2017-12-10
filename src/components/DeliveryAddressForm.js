import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base'
import _ from 'underscore'

export default class DeliveryAddressForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      streetAddress: props.streetAddress || '',
      postalCode: props.postalCode || '',
      addressLocality: props.addressLocality || ''
    }
  }
  createDeliveryAddress() {
    return this.state
  }
  render() {

    const errors = this.props.errors || []

    const inputProps = {
      autoCorrect: false,
      autoCapitalize: 'none',
    }

    const postalCodeProps = _.contains(errors, 'postalCode') ? { error: true } : {}

    return (
      <Form>
        <Item stackedLabel>
          <Label>Adresse</Label>
          <Input ref="streetAddress"
            { ...inputProps }
            onChangeText={ streetAddress => this.setState({ streetAddress }) }
            value={ this.state.streetAddress } />
        </Item>
        <Item stackedLabel { ...postalCodeProps }>
          <Label>Code postal</Label>
          <Input ref="postalCode"
            { ...inputProps }
            onChangeText={ postalCode => this.setState({ postalCode }) }
            value={ this.state.postalCode } />
        </Item>
        <Item stackedLabel last>
          <Label>Ville</Label>
          <Input ref="addressLocality"
            { ...inputProps }
            onChangeText={ addressLocality => this.setState({ addressLocality }) }
            value={ this.state.addressLocality } />
        </Item>
      </Form>
    );
  }
}
