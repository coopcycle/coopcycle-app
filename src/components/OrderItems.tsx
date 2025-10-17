import _ from 'lodash';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SectionList, StyleSheet, View } from 'react-native';
import { formatPrice } from '../utils/formatting';

import ItemSeparator from './ItemSeparator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adjustmentText: {
    fontSize: 14,
    color: '#999',
  },
  itemQuantity: {
    fontWeight: '600',
    fontSize: 15 * 1.2,
  },
  textHighlight: {
    color: '#FF851B',
  },
});

const CartLine = props => {
  return (
    <HStack p="2" justifyContent="space-between">
      <Text bold>{props.label}</Text>
      <Text bold>{props.value}</Text>
    </HStack>
  );
};

const SectionHeader = ({ section: { title } }) => (
  <Text
    style={{
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontWeight: '700',
      color: '#c7c7c7',
    }}>
    {title}
  </Text>
);

const ItemAdjustments = ({ adjustments, important = false }) => {

  const textStyle = [styles.adjustmentText];
  if (important) {
    textStyle.push(styles.textHighlight);
  }

  return (
    <View>
      {adjustments.map((adjustment, index) => (
        <Text style={textStyle} key={`ADJUSTMENT#${index}`}>
          {adjustment.label}
        </Text>
      ))}
    </View>
  );
}

const Adjustments = ({ order }) => {

  const { t } = useTranslation();

  return (
    <>
      <CartLine
        label={t('TOTAL_DELIVERY')}
        value={`${formatPrice(deliveryTotal(order))}`}
      />
      <CartLine
        label={t('TIP')}
        value={`${formatPrice(
          order.adjustments.tip[0]?.amount || 0,
        )}`}
      />
    </>
  );
}

const ItemsTotal = ({ order }) => {

  const { t } = useTranslation();

  return (
    <CartLine
      label={t('TOTAL_ITEMS')}
      value={`${formatPrice(order.itemsTotal)}`}
    />
  );
}

const Total = ({ order }) => {

  const { t } = useTranslation();

  return (
    <CartLine
      label={t('TOTAL')}
      value={`${formatPrice(order.total)}`}
    />
  );
}

const ListItem = ({ item }) => {

  const itemQuantityStyle = [styles.itemQuantity];
  if (item.quantity > 1) {
    itemQuantityStyle.push(styles.textHighlight);
  }

  return (
    <HStack className="p-2 justify-between">
      <Box style={{ width: "15%"}}>
        <Text style={itemQuantityStyle}>{`${item.quantity} ×`}</Text>
      </Box>
      <Box style={{ width: "70%"}}>
        <Text>{item.name}</Text>
        {item.adjustments &&
          item.adjustments.hasOwnProperty('menu_item_modifier') &&
          <ItemAdjustments adjustments={ item.adjustments.menu_item_modifier } /> }
        {item.adjustments &&
          item.adjustments.hasOwnProperty('reusable_packaging') &&
          <ItemAdjustments adjustments={ item.adjustments.reusable_packaging } important={ true } /> }
      </Box>
      <Box style={{ width: "15%" }} className="items-end">
        <Text>{`${formatPrice(item.total)}`}</Text>
      </Box>
    </HStack>
  );
}

const itemsToSections = itemsGroupedByVendor =>
  _.map(itemsGroupedByVendor, items => ({
    title: items[0].vendor.name,
    data: items,
  }));

function deliveryTotal(order) {
  if (!order.adjustments) {
    return 0;
  }

  if (!order.adjustments.hasOwnProperty('delivery')) {
    return 0;
  }

  return _.reduce(
    order.adjustments.delivery,
    function (total, adj) {
      return total + adj.amount;
    },
    0,
  );
}

interface OrderItemsProps {
  order?: unknown;
  withDeliveryTotal?: boolean;
  withTotals?: boolean;
}

const OrderItems = ({ order, withDeliveryTotal = false, withTotals = true}: OrderItemsProps) =>  {

  const { order } = this.props;

  const itemsGroupedByVendor = _.groupBy(order.items, 'vendor.@id');
  const isMultiVendor = _.size(itemsGroupedByVendor) > 1;

  const items = isMultiVendor
    ? itemsToSections(itemsGroupedByVendor)
    : order.items;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {isMultiVendor && (
          <SectionList
            sections={items}
            keyExtractor={(item, index) => `ITEM#${item.id}`}
            renderItem={({ item }) => <ListItem item={item} />}
            renderSectionHeader={SectionHeader}
          />
        )}
        {!isMultiVendor && (
          <FlatList
            data={items}
            keyExtractor={(item, index) => `ITEM#${item.id}`}
            renderItem={({ item }) => <ListItem item={item} />}
            ItemSeparatorComponent={ItemSeparator}
          />
        )}
      </View>
      {withTotals && (
        <View style={{ flex: 0, flexShrink: 1 }}>
          <ItemsTotal order={order} />
          {this.props.withDeliveryTotal === true && <Adjustments order={order} />}
          {this.props.withDeliveryTotal === true && <Total order={order} />}
        </View>
      )}
    </View>
  );
}

export default OrderItems;
