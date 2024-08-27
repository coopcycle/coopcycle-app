import { Center, Icon, Text } from 'native-base';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';

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

const styles = StyleSheet.create({
  alert: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 10,
  },
  icon: {
    fontSize: 36,
    textAlign: 'center',
  },
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
    <Center flex={1}>
      <View style={styles.alert}>
        <Icon as={Foundation} name="dollar-bill" style={styles.icon} />
        <Text>{t('CASH_ON_DELIVERY_DISCLAIMER')}</Text>
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
        text={t('SUBMIT')}
        onPress={onSubmit}
      />
      <TimeRangeChangedModal />
    </Center>
  );
};

export default CashOnDelivery;
