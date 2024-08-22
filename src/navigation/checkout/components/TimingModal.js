import { Button, Divider, Heading, Text, View } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import BottomModal from '../../../components/BottomModal';
import { showTimingModal } from '../../../redux/Checkout/actions';
import TimingCartSelect from './TimingCartSelect';

class TimingModal extends Component {
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
              <Button.Group
                isAttached
                mx={{
                  base: 'auto',
                  md: 0,
                }}
                size="sm">
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
                  {this.props.t('FULFILLMENT_METHOD.delivery')}
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
                  {this.props.t('FULFILLMENT_METHOD.collection')}
                </Button>
              </Button.Group>
            )}
            {this.props.message && (
              <Text marginBottom={50}>{this.props.message}</Text>
            )}
            {!this.props.message && <View marginBottom={30} />}
            <TimingCartSelect
              orderNodeId={this.props.orderNodeId}
              onValueChange={this.setValue}
            />
            <Button
              flex={4}
              onPress={() =>
                this.props.onSchedule({
                  value: this.state.value,
                  showModal: this.showModal,
                })
              }>
              {this.props.t('SCHEDULE')}
            </Button>
            <Button
              variant={'subtle'}
              onPress={() => {
                this.showModal(false);
                this.props.onSkip();
              }}>
              {this.props.t('IGNORE')}
            </Button>
          </BottomModal>
        )}
      </>
    );
  }
}

TimingModal.defaultProps = {
  modalEnabled: true,
  fulfillmentMethods: [],
  orderNodeId: null,
  cartFulfillmentMethod: null,
  onFulfillmentMethodChange: () => {},
  onSchedule: () => {},
  onSkip: () => {},
};

TimingModal.propTypes = {
  openingHoursSpecification: PropTypes.object.isRequired,
  fulfillmentMethods: PropTypes.arrayOf(PropTypes.string),
  orderNodeId: PropTypes.string,
  cartFulfillmentMethod: PropTypes.string,
  onFulfillmentMethodChange: PropTypes.func,
  modalEnabled: PropTypes.bool,
  onSchedule: PropTypes.func,
  onSkip: PropTypes.func,
};

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
