import { Button, FlatList, HStack, Icon } from 'native-base';
import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { phonecall } from 'react-native-communications';
import { showLocation } from 'react-native-map-link';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ItemSeparator from '../../../components/ItemSeparator';
import {
  isDisplayPaymentMethodInList,
  loadDescriptionTranslationKey,
  loadIconKey,
} from '../../../components/PaymentMethodInfo';
import { formatPrice } from '../../../utils/formatting';
import { getAddress, getName, getPackagesSummary, getTimeFrame } from './utils';
import { getTaskTitle } from '../../../shared/src/utils';
import Detail from '../../../components/Detail';

const Details = ({ task, onTaskTitleClick, t }) => {
  const timeframe = getTimeFrame(task);
  let address = getAddress(task);
  const name = getName(task);
  address = name ? [name, address].join(' - ') : address;

  const renderTaskTitle = () => (
    <Text
      style={{
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 10,
        marginVertical: 10,
      }}>
      {getTaskTitle(task)} (#{task.id})
    </Text>
  );

  const items = [
    {
      iconName: 'navigate',
      text: address,
      onPress: () =>
        showLocation({
          latitude: task.address.geo.latitude,
          longitude: task.address.geo.longitude,
          dialogTitle: t('OPEN_IN_MAPS_TITLE'),
          dialogMessage: t('OPEN_IN_MAPS_MESSAGE'),
          cancelText: t('CANCEL'),
        }),
    },
    {
      iconName: 'time',
      text: timeframe,
    },
  ];

  if (task.address.telephone) {
    items.push({
      iconName: 'call',
      text: task.address.telephone,
      onPress: () => phonecall(task.address.telephone, true),
    });
  }

  if (task.metadata && task.metadata.has_loopeat_returns) {
    items.push({
      iconName: 'recycle',
      iconType: FontAwesome5,
      text: t('LOOPEAT_HAS_RETURNS'),
    });
  }

  if (task.address.description) {
    items.push({
      iconName: 'information-circle',
      text: task.address.description,
    });
  }

  if (
    task.metadata &&
    task.metadata.payment_method &&
    isDisplayPaymentMethodInList(task.metadata.payment_method)
  ) {
    items.push({
      iconName: loadIconKey(task.metadata.payment_method),
      iconType: Foundation,
      text:
        t(loadDescriptionTranslationKey(task.metadata.payment_method)) +
        (task.metadata.order_total
          ? `: ${formatPrice(task.metadata.order_total)}`
          : ''),
    });
  }

  if (task.comments) {
    items.push({
      iconName: 'chatbubbles',
      text: task.comments,
    });
  }

  if (task.tags.length > 0) {
    items.push({
      iconName: 'star',
      component: (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {task.tags.map(tag => (
            <Button
              style={{ backgroundColor: tag.color, marginRight: 5 }}
              key={tag.slug}
              small
              disabled>
              <Text style={{ fontSize: 10 }}>{tag.slug}</Text>
            </Button>
          ))}
        </View>
      ),
    });
  }

  if (task.packages && task.packages.length) {
    const packagesSummary = getPackagesSummary(task);
    items.push({
      iconName: 'cube',
      text: `${packagesSummary.text}`,
      component: (
        <Text fontWeight="bold">
          {t('total_packages', { count: packagesSummary.totalQuantity })}
        </Text>
      ),
    });
  }

  if (task.weight) {
    items.push({
      iconName: 'scale',
      iconType: MaterialCommunityIcons,
      text: `${(Number(task.weight) / 1000).toFixed(2)} kg`,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      {onTaskTitleClick && (
        <TouchableOpacity
          onPress={() => {
            onTaskTitleClick(task);
          }}
          style={{ flex: 1 }}>
          <HStack alignItems="center" justifyContent="space-between" p="2">
            {renderTaskTitle()}
            <Icon
              as={Ionicons}
              name="arrow-forward"
              style={{ color: '#ccc' }}
            />
          </HStack>
        </TouchableOpacity>
      )}
      {!onTaskTitleClick && renderTaskTitle()}
      <FlatList
        data={items}
        keyExtractor={(item, index) => `task-detail-${item.iconName}-${index}`}
        renderItem={({ item }) => <Detail item={item} />}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default withTranslation()(Details);
