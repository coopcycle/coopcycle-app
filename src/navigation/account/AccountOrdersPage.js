import React, { Component } from 'react';
import {
  InteractionManager,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { Box, HStack, Heading, Text, VStack } from 'native-base';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/formatting';
import { loadOrders } from '../../redux/Account/actions';
import ItemSeparator from '../../components/ItemSeparator';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { blueColor, greenColor, redColor } from '../../styles/common';
import i18n from '../../i18n';

class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (this.props.orders.length === 0) {
        this._refresh();
      }
    });
  }

  _renderItem(order) {
    const { navigate } = this.props.navigation;

    const stateToRender = state => {
      switch (state) {
        case 'fulfilled':
          return {
            text: i18n.t('ORDER_FULFILLED'),
            style: styles.fulfilled,
            route: 'AccountOrder',
          };
        case 'cancelled':
        case 'refused':
          return {
            text: i18n.t('ORDER_CANCELLED'),
            style: styles.cancelled,
            route: 'AccountOrder',
          };
        default:
          return {
            text: i18n.t('ORDER_NEW'),
            style: styles.new,
            route: 'OrderTracking',
          };
      }
    };
    const state = stateToRender(order.state);
    return (
      <TouchableNativeFeedback
        onPress={() => navigate(state.route, { order: order.number })}>
        <HStack justifyContent="space-between" p="2">
          <VStack>
            <Text fontSize={16} paddingBottom={1}>
              {order.restaurant.name}
            </Text>
            <HStack space={2}>
              <Text fontFamily={'RobotoMono-Regular'} style={styles.badge}>
                {order.number}
              </Text>
              <Box
                style={{
                  ...styles.badge,
                  ...state.style,
                }}>
                <Text>{state.text}</Text>
              </Box>
            </HStack>
          </VStack>
          <Text>{formatPrice(order.total)}</Text>
        </HStack>
      </TouchableNativeFeedback>
    );
  }

  _renderSectionHeader(section) {
    return (
      <Heading size="sm" p="2">
        {moment(section.day).format('LL')}
      </Heading>
    );
  }

  _refresh() {
    this.setState({ refreshing: true });
    this.props.loadOrders(() => this.setState({ refreshing: false }));
  }

  render() {
    const ordersByDay = _.groupBy(this.props.orders, order =>
      moment(order.shippedAt).format('YYYY-MM-DD'),
    );

    let sections = [];
    _.forEach(ordersByDay, (orders, day) => {
      sections.push({
        day: day,
        data: orders,
      });
    });

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this._refresh()}
            />
          }
          initialNumToRender={15}
          sections={sections}
          renderItem={({ item }) => this._renderItem(item)}
          renderSectionHeader={({ section }) =>
            this._renderSectionHeader(section)
          }
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#00000011',
    borderRadius: 3,
    paddingHorizontal: 3,
  },
  new: {
    backgroundColor: blueColor + '44',
  },
  cancelled: {
    backgroundColor: redColor + '44',
  },
  fulfilled: {
    backgroundColor: greenColor + '44',
  },
});

function mapStateToProps(state) {
  // At the moment, we only show foodtech orders
  const orders = _.filter(state.account.orders, o => !!o.restaurant);

  return {
    orders,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrders: cb => dispatch(loadOrders(cb)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AccountOrdersPage));
