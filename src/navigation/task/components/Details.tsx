import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { ArrowRightIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { phonecall } from 'react-native-communications';
import { showLocation } from 'react-native-map-link';
import { Box, Clock, Info, MapPin, MessageCircle, Phone, Recycle, Tag, Weight } from 'lucide-react-native';

import ItemSeparator from '../../../components/ItemSeparator';
import {
  getIcon,
  isDisplayPaymentMethodInList,
  loadDescriptionTranslationKey,
} from '../../../components/PaymentMethodInfo';
import { formatPrice } from '../../../utils/formatting';
import { getAddress, getName, getPackagesSummary, getTimeFrame } from './utils';
import Detail from '../../../components/Detail';

export const styles = StyleSheet.create({
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 10,
    marginVertical: 10,
  },
  // This one is used just for dev and e2e tests purposes
  invisibleText: __DEV__ ? { fontSize: 12 } : { color: 'transparent', fontSize: 0 },
});

const Details = ({ task, onTaskTitleClick, t }) => {
  const timeframe = getTimeFrame(task);
  let address = getAddress(task);
  const name = getName(task);
  address = name ? [name, address].join(' - ') : address;

  const renderTaskTitle = () => (
    <Text style={styles.titleText}>
      {task.orgName}
      <Text style={styles.invisibleText}>{` (task #${task.id})`}</Text>
    </Text>
  );

  const items = [
    {
      icon: MapPin,
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
      icon: Clock,
      text: timeframe,
    },
  ];

  if (task.address.telephone) {
    items.push({
      icon: Phone,
      text: task.address.telephone,
      onPress: () => phonecall(task.address.telephone, true),
    });
  }

  if (task.metadata && task.metadata.has_loopeat_returns) {
    items.push({
      icon: Recycle,
      text: t('LOOPEAT_HAS_RETURNS'),
    });
  }

  if (task.address.description) {
    items.push({
      icon: Info,
      text: task.address.description,
    });
  }

  if (
    task.metadata &&
    task.metadata.payment_method &&
    isDisplayPaymentMethodInList(task.metadata.payment_method)
  ) {
    items.push({
      icon: getIcon(task.metadata.payment_method),
      text:
        t(loadDescriptionTranslationKey(task.metadata.payment_method)) +
        (task.metadata.order_total
          ? `: ${formatPrice(task.metadata.order_total)}`
          : ''),
    });
  }

  if (task.comments) {
    items.push({
      icon: MessageCircle,
      text: task.comments,
    });
  }

  if (task.tags.length > 0) {
    items.push({
      icon: Tag,
      component: (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {task.tags.map(tag => (
            <Button
              className="mr-1"
              style={{ backgroundColor: tag.color }}
              key={tag.slug}
              size="xs"
              disabled>
              <ButtonText>{tag.slug}</ButtonText>
            </Button>
          ))}
        </View>
      ),
    });
  }

  if (task.packages && task.packages.length) {
    const packagesSummary = getPackagesSummary(task);
    items.push({
      icon: Box,
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
      icon: Weight,
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
          <HStack className="items-center justify-between p-2">
            {renderTaskTitle()}
            <Icon as={ArrowRightIcon} />
          </HStack>
        </TouchableOpacity>
      )}
      {!onTaskTitleClick && renderTaskTitle()}
      <FlatList
        data={items}
        keyExtractor={(item, index) => `task-detail-${index}`}
        renderItem={({ item }) => <Detail item={item} />}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
};

export default withTranslation()(Details);
