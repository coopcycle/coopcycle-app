import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { HStack, Icon, Text } from 'native-base';
import OrderNumber from '../../../components/OrderNumber';
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon';
import { PaymentMethodInfo } from '../../../components/PaymentMethodInfo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { formatPrice } from '../../../utils/formatting';
import moment from 'moment/moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { useDispatch } from 'react-redux';
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
    marginLeft: 24 + 16,
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
});

export default function OrderListItem({ order, onItemClick }) {
  const dispatch = useDispatch();

  const isActionable = [STATE.NEW, STATE.ACCEPTED, STATE.STARTED].includes(
    order.state,
  );

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onItemClick(order)}>
        <HStack alignItems="center">
          <View style={styles.number}>
            <OrderNumber order={order} />
          </View>
          <OrderFulfillmentMethodIcon order={order} small />
          <PaymentMethodInfo
            fullDetail={false}
            paymentMethod={order.paymentMethod}
          />
          {order.notes ? (
            <Icon as={FontAwesome} name="comments" size="xs" />
          ) : null}
        </HStack>
        <Text>{`${formatPrice(order.itemsTotal)}`}</Text>
        <Text>{moment.parseZone(order.pickupExpectedAt).format('LT')}</Text>
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
            size={5}
            as={Ionicons}
            style={styles.moveForwardIcon}
            name="arrow-forward"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
