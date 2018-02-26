import React, { Component } from 'react'
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base'
import _ from 'underscore'
import { translate } from 'react-i18next'

class DeliveryAddressForm extends Component {
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
          <Label>{this.props.t('ADDRESS')}</Label>
          <Input ref="streetAddress"
            { ...inputProps }
            onChangeText={ streetAddress => this.setState({ streetAddress }) }
            value={ this.state.streetAddress } />
        </Item>
        <Item stackedLabel { ...postalCodeProps }>
          <Label>{this.props.t('POST_CODE')}</Label>
          <Input ref="postalCode"
            { ...inputProps }
            onChangeText={ postalCode => this.setState({ postalCode }) }
            value={ this.state.postalCode } />
        </Item>
        <Item stackedLabel last>
          <Label>{this.props.t('CITY')}</Label>
          <Input ref="addressLocality"
            { ...inputProps }
            onChangeText={ addressLocality => this.setState({ addressLocality }) }
            value={ this.state.addressLocality } />
        </Item>
      </Form>
    );
  }
}

export default translate()(DeliveryAddressForm)
