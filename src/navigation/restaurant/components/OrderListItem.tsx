import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, MessageCircleIcon, ArrowRightIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import { useDispatch, useSelector } from 'react-redux';
import OrderNumber from '../../../components/OrderNumber';
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon';
import { PaymentMethodInList } from '../../../components/PaymentMethodInfo';
import {
  selectAutoAcceptOrdersEnabled,
  selectIsActionable,
  selectOrderIdsFailedToPrint,
  selectPrintingOrderId,
} from '../../../redux/Restaurant/selectors';
import { formatPrice } from '../../../utils/formatting';
import {
  acceptOrder,
  finishPreparing,
  startPreparing,
} from '../../../redux/Restaurant/actions';
import { STATE } from '../../../domain/Order';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 6,
    marginLeft: 24,
    marginRight: 24,
    borderColor: '#E3E3E3',
    borderWidth: 1,
    borderRadius: 4,
  },
  content: {
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  number: {
    marginRight: 10,
  },
  moveForward: {
    backgroundColor: '#5EBE68',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  moveForwardIcon: {
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  printing: {
    backgroundColor: '#26de81',
    borderBottomColor: '#1cb568',
  },
  failedToPrint: {
    backgroundColor: '#f7b731',
    borderBottomColor: '#eca309',
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});

function OrderPrintStatus({ order }) {
  const printingOrderId = useSelector(selectPrintingOrderId);
  const orderIdsFailedToPrint = useSelector(selectOrderIdsFailedToPrint);

  const isPrinting = order['@id'] === printingOrderId;
  const isFailedToPrint = orderIdsFailedToPrint.indexOf(order['@id']) !== -1;

  const { t } = useTranslation();

  if (isPrinting) {
    return (
      <View style={[styles.statusContainer, styles.printing]}>
        <Text style={styles.statusText}>{t('RESTAURANT_ORDER_PRINTING')}</Text>
        <ActivityIndicator size="small" color="white" animating={true} />
      </View>
    );
  }

  if (isFailedToPrint) {
    return (
      <View style={[styles.statusContainer, styles.failedToPrint]}>
        <Text style={styles.statusText}>
          {t('RESTAURANT_ORDER_FAILED_TO_PRINT')}
        </Text>
      </View>
    );
  }

  return null;
}

export default function OrderListItem({ order, onItemClick }) {
  const autoAcceptOrdersEnabled = useSelector(selectAutoAcceptOrdersEnabled);
  const isActionable = useSelector(state => selectIsActionable(state, order));

  const dispatch = useDispatch();

  return (
    <View style={styles.item}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => onItemClick(order)}>
        <View style={styles.content}>
          <HStack className="items-center">
            <View style={styles.number}>
              <OrderNumber order={order} />
            </View>
            <OrderFulfillmentMethodIcon order={order} small />
            <PaymentMethodInList paymentMethod={order.paymentMethod} />
            {order.notes ? (
              <Icon as={MessageCircleIcon} size="sm" />
            ) : null}
          </HStack>
          <Text>{`${formatPrice(order.itemsTotal)}`}</Text>
          <Text>{moment.parseZone(order.pickupExpectedAt).format('LT')}</Text>
        </View>
        {autoAcceptOrdersEnabled && order.state === STATE.ACCEPTED ? (
          <OrderPrintStatus order={order} />
        ) : null}
      </TouchableOpacity>
      {isActionable ? (
        <TouchableOpacity
          style={styles.moveForward}
          onPress={() => {
            switch (order.state) {
              case STATE.NEW:
                dispatch(acceptOrder(order));
                break;
              case STATE.ACCEPTED:
                dispatch(startPreparing(order));
                break;
              case STATE.STARTED:
                dispatch(finishPreparing(order));
                break;
              default:
                break;
            }
          }}>
          <Icon
            as={ArrowRightIcon}
            style={styles.moveForwardIcon}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
