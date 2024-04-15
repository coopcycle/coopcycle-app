import React, { Component } from 'react';
import { FormControl, Input, VStack } from 'native-base';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

const inputProps = {
  autoCorrect: false,
  autoCapitalize: 'none',
};

class DeliveryAddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      streetAddress: props.streetAddress || '',
      postalCode: props.postalCode || '',
      addressLocality: props.addressLocality || '',
      name: props.name || '',
      telephone: props.telephone || '',
      description: props.description || '',
    };
  }

  createDeliveryAddress() {
    return _.pickBy(this.state, (value, key) => !_.isEmpty(value));
  }

  renderName() {
    return (
      <FormControl>
        <FormControl.Label>{this.props.t('NAME')}</FormControl.Label>
        <Input
          {...inputProps}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
      </FormControl>
    );
  }

  renderDescription() {
    return (
      <FormControl>
        <FormControl.Label>
          {this.props.t('ADDRESS_DESCRIPTION')}
        </FormControl.Label>
        <Input
          {...inputProps}
          multiline
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
          style={{ height: 5 * 25 }}
        />
      </FormControl>
    );
  }

  renderTelephone() {
    return (
      <FormControl>
        <FormControl.Label>{this.props.t('TELEPHONE')}</FormControl.Label>
        <Input
          {...inputProps}
          onChangeText={telephone => this.setState({ telephone })}
          value={this.state.telephone}
        />
      </FormControl>
    );
  }

  render() {
    const errors = this.props.errors || [];
    const extended = this.props.extended || false;

    const postalCodeProps = _.includes(errors, 'postalCode')
      ? { error: true }
      : {};

    return (
      <VStack>
        <FormControl>
          <FormControl.Label>{this.props.t('ADDRESS')}</FormControl.Label>
          <Input
            {...inputProps}
            onChangeText={streetAddress => this.setState({ streetAddress })}
            value={this.state.streetAddress}
          />
        </FormControl>
        <FormControl {...postalCodeProps}>
          <FormControl.Label>{this.props.t('POST_CODE')}</FormControl.Label>
          <Input
            {...inputProps}
            onChangeText={postalCode => this.setState({ postalCode })}
            value={this.state.postalCode}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>{this.props.t('CITY')}</FormControl.Label>
          <Input
            {...inputProps}
            onChangeText={addressLocality => this.setState({ addressLocality })}
            value={this.state.addressLocality}
          />
        </FormControl>
        {extended && this.renderName()}
        {extended && this.renderDescription()}
        {extended && this.renderTelephone()}
      </VStack>
    );
  }
}

export default withTranslation(['common'], { withRef: true })(
  DeliveryAddressForm,
);
