import _ from 'lodash';
import moment from 'moment';
import { Icon, ChevronRightIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { stateColor } from '../utils/delivery';
import ItemSeparator from './ItemSeparator';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  textSmall: {
    fontSize: 12,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  headerText: {
    fontSize: 14,
    color: '#BBBBBB',
    fontWeight: '600',
  },
  details: {
    paddingHorizontal: 10,
  },
});

const SectionHeaderComponent = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const captionTextProps = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
};

interface DeliveryListProps {
  data?: object[];
  loading?: boolean;
  onItemPress(...args: unknown[]): unknown;
  onEndReached(...args: unknown[]): unknown;
  itemCaptionLines?(...args: unknown[]): unknown;
  onRefresh?(...args: unknown[]): unknown;
  refreshing?: boolean;
}

const ListItem = ({ item, itemCaptionLines, onPress }) => {

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={styles.item}>
      <View style={styles.itemBody}>
        <View style={{ flex: 1 }}>
          <FontAwesome5
            name="circle"
            solid
            style={{ color: stateColor(item.state), fontSize: 14 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.textSmall}>{`#${
            item.orderNumber ? item.orderNumber : item.id
          }`}</Text>
        </View>
        <View style={[styles.details, { flex: 6 }]}>
          <ListItemCaption item={item} itemCaptionLines={itemCaptionLines} />
        </View>
        {/* @see https://stackoverflow.com/questions/43143258/flex-vs-flexgrow-vs-flexshrink-vs-flexbasis-in-react-native */}
        <View style={{ flex: 0, flexShrink: 1 }}>
          <Text style={styles.textSmall} numberOfLines={1}>
            {moment(item.dropoff.doneBefore).format('LT')}
          </Text>
        </View>
      </View>
      <View>
        <Icon as={ChevronRightIcon} />
      </View>
    </TouchableOpacity>
  );
}

const ListItemCaption = ({ item, itemCaptionLines }) => {
  const lines = itemCaptionLines
    ? itemCaptionLines(item)
    : [item.pickup.address.streetAddress, item.dropoff.address.streetAddress];

  return (
    <View>
      {lines.map((line, index) => (
        <Text
          key={`${item['@id']}-caption-line-${index}`}
          style={styles.textSmall}
          {...captionTextProps}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const ListFooter = ({ loading }) => {

  if (!loading) {
    return null;
  }

  return (
    <View
      style={{
        position: 'relative',
        paddingVertical: 20,
        marginTop: 10,
        marginBottom: 10,
      }}>
      <ActivityIndicator animating size="large" />
    </View>
  );
}

function _onItemPress(item, loading, refreshing, onItemPress) {
  if (loading || refreshing) {
    return;
  }

  onItemPress(item);
}

const DeliveryList = ({
  onItemPress,
  onEndReached,
  itemCaptionLines,
  onRefresh = () => {},
  data = [],
  loading = false,
  refreshing = false }: DeliveryListProps) => {

  if (data.length === 0) {
    return <View />;
  }

  const groups = _.groupBy(data, item =>
    moment(item.dropoff.doneBefore).format('LL'),
  );
  const sections = _.map(groups, (value, key) => ({
    title: key,
    data: value,
  }));

  return (
    <SectionList
      stickySectionHeadersEnabled={false}
      initialNumToRender={17}
      sections={sections}
      onEndReached={onEndReached}
      onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.01}
      onRefresh={onRefresh}
      refreshing={refreshing}
      keyExtractor={(item, index) => item['@id']}
      renderItem={({ item }) => <ListItem item={item} itemCaptionLines={ itemCaptionLines } onPress={() => _onItemPress(item, loading, refreshing, onItemPress)} /> }
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={() => <ListFooter loading={loading} />}
      renderSectionHeader={({ section: { title } }) => (
        <SectionHeaderComponent title={title} />
      )}
    />
  );
}

export default DeliveryList;
