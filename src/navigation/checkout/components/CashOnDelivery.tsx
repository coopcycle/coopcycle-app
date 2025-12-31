import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import FooterButton from './FooterButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  canProceedWithPayment,
  checkoutWithCash,
} from '../../../redux/Checkout/actions';
import TimeRangeChangedModal from './TimeRangeChangedModal';
import {
  selectCart,
  selectCheckoutError,
} from '../../../redux/Checkout/selectors';
import {
  CashOnDeliveryDisclaimer
} from '@/src/navigation/checkout/components/CashOnDeliveryDisclaimer';

const styles = StyleSheet.create({
  errorsContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  errorText: {
    textAlign: 'center',
    color: '#ed2f2f',
  },
});

const CashOnDelivery = () => {
  const { cart } = useSelector(selectCart);
  const errors = useSelector(selectCheckoutError);

  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onSubmit = async () => {
    setIsLoading(true);

    if ((await dispatch(canProceedWithPayment(cart))) === false) {
      setIsLoading(false);
      // canProceedWithPayment will display error messages
      return;
    }

    dispatch(checkoutWithCash());
  };

  return (
    <Center className="flex-1">
      <View className="mx-3">
        <CashOnDeliveryDisclaimer />
      </View>
      {errors.length > 0 ? (
        <View style={styles.errorsContainer}>
          {errors.map((error, key) => (
            <Text key={key} style={styles.errorText}>
              {error}
            </Text>
          ))}
        </View>
      ) : null}
      <FooterButton
        isLoading={isLoading && errors.length === 0}
        testID="cashOnDeliverySubmit"
        text={t('SUBMIT')}
        onPress={onSubmit}
      />
      <TimeRangeChangedModal />
    </Center>
  );
};

export default CashOnDelivery;
