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
import { selectCart } from '../../../redux/Checkout/selectors';

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
});

const CashOnDelivery = ({ disabled }) => {
  const { cart } = useSelector(selectCart);

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
      <FooterButton
        isDisabled={disabled}
        isLoading={isLoading}
        text={t('SUBMIT')}
        onPress={onSubmit}
      />
      <TimeRangeChangedModal />
    </Center>
  );
};

export default CashOnDelivery;
