import _ from 'lodash';
import moment from 'moment';
import { Icon, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
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

class DeliveryList extends Component {
  _onItemPress(item) {
    if (this.props.loading || this.props.refreshing) {
      return;
    }

    this.props.onItemPress(item);
  }

  renderItemCaption(item) {
    const lines = this.props.itemCaptionLines
      ? this.props.itemCaptionLines(item)
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

  renderItem(item) {
    return (
      <TouchableOpacity
        onPress={() => this._onItemPress(item)}
        style={styles.item}>
        <View style={styles.itemBody}>
          <View style={{ flex: 1 }}>
            <Icon
              as={FontAwesome5}
              name="circle"
              solid
              style={{ color: stateColor(item.state), fontSize: 14 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textSmall}>{`#${item.id}`}</Text>
          </View>
          <View style={[styles.details, { flex: 6 }]}>
            {this.renderItemCaption(item)}
          </View>
          {/* @see https://stackoverflow.com/questions/43143258/flex-vs-flexgrow-vs-flexshrink-vs-flexbasis-in-react-native */}
          <View style={{ flex: 0, flexShrink: 1 }}>
            <Text style={styles.textSmall} numberOfLines={1}>
              {moment(item.dropoff.doneBefore).format('LT')}
            </Text>
          </View>
        </View>
        <View>
          <Icon
            as={FontAwesome5}
            name="chevron-right"
            style={{ color: '#DDDDDD', fontSize: 18 }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderFooter() {
    if (!this.props.loading) {
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

  render() {
    if (this.props.data.length === 0) {
      return <View />;
    }

    const groups = _.groupBy(this.props.data, item =>
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
        // scrollEnabled={ !this.state.loadingMore }
        onEndReached={this.props.onEndReached}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 0.01}
        onRefresh={this.props.onRefresh}
        refreshing={this.props.refreshing}
        keyExtractor={(item, index) => item['@id']}
        renderItem={({ item }) => this.renderItem(item)}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={this.renderFooter.bind(this)}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeaderComponent title={title} />
        )}
      />
    );
  }
}

DeliveryList.defaultProps = {
  data: [],
  loading: false,
  refreshing: false,
  onRefresh: () => {},
};

DeliveryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  onItemPress: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  itemCaptionLines: PropTypes.func,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
};

export default withTranslation()(DeliveryList);
