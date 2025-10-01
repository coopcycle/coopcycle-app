import moment from 'moment';
import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Clock } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon';
import { PaymentMethodInOrderDetails } from '../../../components/PaymentMethodInfo';
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
    marginBottom: 10,
  },
});

const OrderHeading = ({
  order,
  isPrinterConnected,
  onPrinterClick,
  printOrder,
  disablePrintButton,
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
        className="justify-between items-center p-2 mb-1"
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
      <Box style={styles.timeline} className="px-2">
        <Icon as={Clock} size="xl" />
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
      </Box>
      <PaymentMethodInOrderDetails paymentMethod={order.paymentMethod} />
      <View style={{ marginBottom: 15 }}>
        <OrderButtons
          order={order}
          isPrinterConnected={isPrinterConnected}
          onPrinterClick={onPrinterClick}
          printOrder={printOrder}
          disablePrintButton={disablePrintButton}
        />
      </View>
    </View>
  );
};

export default OrderHeading;
