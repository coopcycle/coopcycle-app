import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import ModalContent from '../../../components/ModalContent';
import { hideMultipleServersInSameCityModal } from '../../../redux/Checkout/actions';

class MultipleServersInSameCityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      doNotShowAgain: false,
    };

    this._onChange = this._onChange.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  _onChange(isSelected) {
    this.setState({ doNotShowAgain: isSelected });
  }

  _onClose() {
    if (this.state.doNotShowAgain) {
      this.props.hideMultipleServersInSameCityModal();
    }
    this.setState({ isVisible: false });
  }

  render() {
    return (
      <Modal
        isVisible={
          this.state.isVisible &&
          this.props.multipleServers &&
          this.props.showMultipleServersInSameCityModal
        }>
        <ModalContent>
          <VStack className="items-center justify-center p-4" space="md">
            <Text>
              {this.props.t('MULTIPLE_SERVERS_IN_SAME_CITY_MODAL_TEXT')}
            </Text>
            <Checkbox onChange={this._onChange}>
              <CheckboxIndicator>
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
              <CheckboxLabel>{this.props.t('DO_NOT_SHOW_IT_AGAIN')}</CheckboxLabel>
            </Checkbox>
            <Button onPress={this._onClose}>
              <ButtonText>{this.props.t('CLOSE')}</ButtonText>
            </Button>
          </VStack>
        </ModalContent>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    showMultipleServersInSameCityModal:
      state.checkout.showMultipleServersInSameCityModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideMultipleServersInSameCityModal: () =>
      dispatch(hideMultipleServersInSameCityModal()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(MultipleServersInSameCityModal));
