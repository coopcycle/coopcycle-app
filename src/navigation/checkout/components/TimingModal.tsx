import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonGroup } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  isVisible?: boolean;
  onSchedule?(...args: unknown[]): unknown;
  onSkip?(...args: unknown[]): unknown;
}

const TimingModal = ({
  isVisible,
  showTimingModal,
  onSkip,
  fulfillmentMethods,
  onFulfillmentMethodChange,
  cartFulfillmentMethod,
  message,
  orderNodeId,
  onSchedule,
  modalEnabled = true } :TimingModalProps) => {

  const { t } = useTranslation()
  const [ value, setValue ] = useState(null);

  const showModal = show => showTimingModal(show);

  return (
    <>
      {modalEnabled && (
        <BottomModal
          isVisible={isVisible}
          onBackdropPress={() => {
            showModal(false);
            onSkip();
          }}
          onBackButtonPress={() => {
            showModal(false);
            onSkip();
          }}>
          <Heading size={'sm'}>
            {t('CHECKOUT_SCHEDULE_ORDER')}
          </Heading>
          <Divider />
          {fulfillmentMethods.length > 1 && (
            <ButtonGroup
              flexDirection="row">
              <Button
                flex={1}
                onPress={() =>
                  onFulfillmentMethodChange('delivery')
                }
                variant={
                  cartFulfillmentMethod === 'delivery'
                    ? 'solid'
                    : 'outline'
                }>
                <ButtonText>{t('FULFILLMENT_METHOD.delivery')}</ButtonText>
              </Button>
              <Button
                flex={1}
                onPress={() =>
                  onFulfillmentMethodChange('collection')
                }
                variant={
                  cartFulfillmentMethod === 'collection'
                    ? 'solid'
                    : 'outline'
                }>
                <ButtonText>{t('FULFILLMENT_METHOD.collection')}</ButtonText>
              </Button>
            </ButtonGroup>
          )}
          {message && (
            <Text className="mb-5">{message}</Text>
          )}
          {!message && <View marginBottom={30} />}
          <TimingCartSelect
            orderNodeId={orderNodeId}
            onValueChange={setValue}
          />
          <Button
            testID="setShippingTimeRange"
            onPress={() =>
              onSchedule({
                value,
                showModal: showModal,
              })
            }>
            <ButtonText>{t('SCHEDULE')}</ButtonText>
          </Button>
          <Button
            variant="outline"
            onPress={() => {
              showModal(false);
              onSkip();
            }}>
            <ButtonText>{t('IGNORE')}</ButtonText>
          </Button>
        </BottomModal>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { displayed, message } = state.checkout.timingModal;
  return {
    isVisible: displayed,
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
)(TimingModal);
