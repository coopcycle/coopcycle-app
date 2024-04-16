import { Button, HStack, VStack } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import AddressForm from '../../components/DeliveryAddressForm';

class EditAddress extends Component {
  constructor(props) {
    super(props);

    this.addressForm = React.createRef();
  }

  _onCancel() {
    this.props.navigation.goBack();
  }

  _onSubmit() {
    const { onSubmit } = this.props.route.params;
    const address = this.addressForm.current.createDeliveryAddress();
    onSubmit(address);
    this.props.navigation.goBack();
  }

  render() {
    const { address } = this.props.route.params;

    return (
      <VStack flex={1} p="3" justifyContent="space-between">
        <AddressForm ref={this.addressForm} {...address} extended />
        <HStack>
          <Button flex={1} onPress={this._onCancel.bind(this)}>
            {this.props.t('CANCEL')}
          </Button>
          <Button flex={1} onPress={this._onSubmit.bind(this)}>
            {this.props.t('SUBMIT')}
          </Button>
        </HStack>
      </VStack>
    );
  }
}

export default withTranslation()(EditAddress);
