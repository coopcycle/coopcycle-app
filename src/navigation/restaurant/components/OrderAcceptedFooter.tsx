import { HStack, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';

import material from '../../../../native-base-theme/variables/material';
import { resolveFulfillmentMethod } from '../../../utils/order';

const styles = StyleSheet.create({
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
  refuseBtn: {
    borderColor: material.brandDanger,
  },
  refuseBtnText: {
    color: material.brandDanger,
    fontWeight: 'bold',
  },
  delayBtn: {
    borderColor: '#333',
  },
  fulfillBtn: {
    borderColor: material.brandSuccess,
  },
  delayBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  fulfillBtnText: {
    color: material.brandSuccess,
    fontWeight: 'bold',
  },
});

const OrderAcceptedFooter = ({
  order,
  onPressCancel,
  onPressDelay,
  onPressFulfill,
}) => {
  const { t } = useTranslation();

  const fulfillmentMethod = resolveFulfillmentMethod(order);

  return (
    <HStack>
      <TouchableOpacity
        style={[styles.footerBtn, styles.refuseBtn]}
        onPress={onPressCancel}>
        <Text style={styles.refuseBtnText}>
          {t('RESTAURANT_ORDER_BUTTON_CANCEL')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.footerBtn, styles.delayBtn]}
        onPress={onPressDelay}>
        <Text style={styles.delayBtnText}>
          {t('RESTAURANT_ORDER_BUTTON_DELAY')}
        </Text>
      </TouchableOpacity>
      {fulfillmentMethod === 'collection' && (
        <TouchableOpacity
          style={[styles.footerBtn, styles.fulfillBtn]}
          onPress={onPressFulfill}>
          <Text style={styles.fulfillBtnText}>
            {t('RESTAURANT_ORDER_BUTTON_FULFILL')}
          </Text>
        </TouchableOpacity>
      )}
    </HStack>
  );
};

export default OrderAcceptedFooter;
