import moment from 'moment';
import { HStack, Icon, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import material from '../../../../native-base-theme/variables/material';
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon';
import { PaymentMethodInfo } from '../../../components/PaymentMethodInfo';
import { resolveFulfillmentMethod } from '../../../utils/order';
import OrderButtons from './OrderButtons';

const fallbackFormat = 'dddd D MMM';

const styles = StyleSheet.create({
  fulfillment: {
    backgroundColor: '#f9ca24',
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: material.contentPadding,
    marginBottom: 10,
  },
});

const OrderHeading = ({
  order,
  isPrinterConnected,
  onPrinterClick,
  printOrder,
}) => {
  const { t } = useTranslation();

  const preparationExpectedAt = moment.parseZone(order.preparationExpectedAt);
  const pickupExpectedAt = moment.parseZone(order.pickupExpectedAt);

  return (
    <View
      style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CCCCCC',
      }}>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        style={styles.fulfillment}
        p="2"
        mb="1">
        <OrderFulfillmentMethodIcon order={order} />
        <Text style={{ fontWeight: '700' }}>
          {moment(pickupExpectedAt).calendar(null, {
            lastDay: fallbackFormat,
            sameDay: `[${t('TODAY')}]`,
            nextDay: `[${t('TOMORROW')}]`,
            lastWeek: fallbackFormat,
            nextWeek: fallbackFormat,
            sameElse: fallbackFormat,
          })}
        </Text>
        <Text>
          {t(`FULFILLMENT_METHOD.${resolveFulfillmentMethod(order)}`)}
        </Text>
      </HStack>
      <View style={styles.timeline}>
        <Icon as={FontAwesome} name="clock-o" />
        <View style={{ alignItems: 'flex-end' }}>
          <Text>
            {t('RESTAURANT_ORDER_PREPARATION_EXPECTED_AT', {
              date: preparationExpectedAt.format('LT'),
            })}
          </Text>
          <Text>
            {t('RESTAURANT_ORDER_PICKUP_EXPECTED_AT', {
              date: pickupExpectedAt.format('LT'),
            })}
          </Text>
        </View>
      </View>
      <PaymentMethodInfo
        fullDetail={true}
        paymentMethod={order.paymentMethod}
      />
      <View style={{ marginBottom: 15 }}>
        <OrderButtons
          order={order}
          isPrinterConnected={isPrinterConnected}
          onPrinterClick={onPrinterClick}
          printOrder={printOrder}
        />
      </View>
    </View>
  );
};

export default OrderHeading;
