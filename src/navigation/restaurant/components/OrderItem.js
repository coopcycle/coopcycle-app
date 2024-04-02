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

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  number: {
    marginRight: 10,
  },
});

export default function OrderItem({ order, onItemClick }) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onItemClick(order)}>
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
      <Icon as={Ionicons} style={{ color: '#ccc' }} name="arrow-forward" />
    </TouchableOpacity>
  );
}
