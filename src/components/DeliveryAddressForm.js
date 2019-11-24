import React, { Component } from 'react'
import { Form, Item, Input, Label } from 'native-base'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

const inputProps = {
  autoCorrect: false,
  autoCapitalize: 'none',
}

class DeliveryAddressForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      streetAddress: props.streetAddress || '',
      postalCode: props.postalCode || '',
      addressLocality: props.addressLocality || '',
      name: props.name || '',
      telephone: props.telephone || '',
      description: props.description || '',
    }
  }

  createDeliveryAddress() {
    return _.pickBy(this.state, (value, key) => !_.isEmpty(value))
  }

  renderName() {

    return (
      <Item stackedLabel>
        <Label>{ this.props.t('NAME') }</Label>
        <Input
          { ...inputProps }
          onChangeText={ name => this.setState({ name }) }
          value={ this.state.name } />
      </Item>
    )
  }

  renderDescription() {

    return (
      <Item stackedLabel>
        <Label>{ this.props.t('ADDRESS_DESCRIPTION') }</Label>
        <Input
          { ...inputProps }
          multiline
          onChangeText={ description => this.setState({ description }) }
          value={ this.state.description }
          style={{ height: 5 * 25 }} />
      </Item>
    )
  }

  renderTelephone() {

    return (
      <Item stackedLabel last>
        <Label>{ this.props.t('TELEPHONE') }</Label>
        <Input
          { ...inputProps }
          onChangeText={ telephone => this.setState({ telephone }) }
          value={ this.state.telephone } />
      </Item>
    )
  }

  render() {

    const errors = this.props.errors || []
    const extended = this.props.extended || false

    const postalCodeProps = _.includes(errors, 'postalCode') ? { error: true } : {}
    const addressLocalityProps = extended ? {} : { last: true }

    return (
      <Form>
        <Item stackedLabel>
          <Label>{this.props.t('ADDRESS')}</Label>
          <Input
            { ...inputProps }
            onChangeText={ streetAddress => this.setState({ streetAddress }) }
            value={ this.state.streetAddress } />
        </Item>
        <Item stackedLabel { ...postalCodeProps }>
          <Label>{this.props.t('POST_CODE')}</Label>
          <Input
            { ...inputProps }
            onChangeText={ postalCode => this.setState({ postalCode }) }
            value={ this.state.postalCode } />
        </Item>
        <Item stackedLabel { ...addressLocalityProps }>
          <Label>{this.props.t('CITY')}</Label>
          <Input
            { ...inputProps }
            onChangeText={ addressLocality => this.setState({ addressLocality }) }
            value={ this.state.addressLocality } />
        </Item>
        { extended && this.renderName() }
        { extended && this.renderDescription() }
        { extended && this.renderTelephone() }
      </Form>
    );
  }
}

export default withTranslation(['common'], { withRef: true })(DeliveryAddressForm)
