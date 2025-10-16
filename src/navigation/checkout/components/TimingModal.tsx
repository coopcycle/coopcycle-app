import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import React, { Component } from 'react';
import { View } from 'react-native';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import BottomModal from '../../../components/BottomModal';
import { showTimingModal } from '../../../redux/Checkout/actions';
import TimingCartSelect from './TimingCartSelect';

interface TimingModalProps {
  openingHoursSpecification: object;
  fulfillmentMethods?: string[];
  orderNodeId?: string;
  cartFulfillmentMethod?: string;
  onFulfillmentMethodChange?(...args: unknown[]): unknown;
  modalEnabled?: boolean;
  onSchedule?(...args: unknown[]): unknown;
  onSkip?(...args: unknown[]): unknown;
}

class TimingModal extends Component<TimingModalProps> {
  constructor(props) {
    super(props);
    this.state = {
      timeSlot: {},
      closed: false,
      closesSoon: false,
      opensSoon: false,
      value: null,
      valid: true,
    };
  }

  showModal = show => this.props.showTimingModal(show);
  setValue = value => this.setState({ value });

  render() {
    return (
      <>
        {this.props.modalEnabled && (
          <BottomModal
            isVisible={this.props.timingModal}
            onBackdropPress={() => {
              this.showModal(false);
              this.props.onSkip();
            }}
            onBackButtonPress={() => {
              this.showModal(false);
              this.props.onSkip();
            }}>
            <Heading size={'sm'}>
              {this.props.t('CHECKOUT_SCHEDULE_ORDER')}
            </Heading>
            <Divider />
            {this.props.fulfillmentMethods.length > 1 && (
              <ButtonGroup
                flexDirection="row">
                <Button
                  flex={1}
                  onPress={() =>
                    this.props.onFulfillmentMethodChange('delivery')
                  }
                  variant={
                    this.props.cartFulfillmentMethod === 'delivery'
                      ? 'solid'
                      : 'outline'
                  }>
                  <ButtonText>{this.props.t('FULFILLMENT_METHOD.delivery')}</ButtonText>
                </Button>
                <Button
                  flex={1}
                  onPress={() =>
                    this.props.onFulfillmentMethodChange('collection')
                  }
                  variant={
                    this.props.cartFulfillmentMethod === 'collection'
                      ? 'solid'
                      : 'outline'
                  }>
                  <ButtonText>{this.props.t('FULFILLMENT_METHOD.collection')}</ButtonText>
                </Button>
              </ButtonGroup>
            )}
            {this.props.message && (
              <Text className="mb-5">{this.props.message}</Text>
            )}
            {!this.props.message && <View marginBottom={30} />}
            <TimingCartSelect
              orderNodeId={this.props.orderNodeId}
              onValueChange={this.setValue}
            />
            <Button
              testID="setShippingTimeRange"
              onPress={() =>
                this.props.onSchedule({
                  value: this.state.value,
                  showModal: this.showModal,
                })
              }>
              <ButtonText>{this.props.t('SCHEDULE')}</ButtonText>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                this.showModal(false);
                this.props.onSkip();
              }}>
              <ButtonText>{this.props.t('IGNORE')}</ButtonText>
            </Button>
          </BottomModal>
        )}
      </>
    );
  }

  static defaultProps = {
    modalEnabled: true,
    fulfillmentMethods: [],
    orderNodeId: null,
    cartFulfillmentMethod: null,
    onFulfillmentMethodChange: () => {},
    onSchedule: () => {},
    onSkip: () => {},
  };
}

function mapStateToProps(state) {
  const { displayed, message } = state.checkout.timingModal;
  return {
    timingModal: displayed,
    message,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showTimingModal: show => dispatch(showTimingModal(show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(TimingModal));
