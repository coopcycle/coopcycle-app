import { Center, Icon, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Foundation from 'react-native-vector-icons/Foundation';

import FooterButton from './FooterButton';
import { useDispatch } from 'react-redux';
import { checkoutWithCash } from '../../../redux/Checkout/actions';

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
  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <Center flex={1}>
      <View style={styles.alert}>
        <Icon as={Foundation} name="dollar-bill" style={styles.icon} />
        <Text>{t('CASH_ON_DELIVERY_DISCLAIMER')}</Text>
      </View>
      <FooterButton
        isDisabled={disabled}
        text={t('SUBMIT')}
        onPress={() => dispatch(checkoutWithCash())}
      />
    </Center>
  );
};

export default CashOnDelivery;
