import _ from 'lodash';
import moment from 'moment';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  InteractionManager,
  RefreshControl,
  SectionList,
  View,
} from 'react-native';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import ItemSeparator from '../../components/ItemSeparator';
import i18n from '../../i18n';
import { loadOrders } from '../../redux/Account/actions';
import { formatPrice } from '../../utils/formatting';

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
            style: "success",
            route: 'AccountOrder',
          };
        case 'cancelled':
        case 'refused':
          return {
            text: i18n.t('ORDER_CANCELLED'),
            route: 'AccountOrder',
            style: "error",
          };
        default:
          return {
            text: i18n.t('ORDER_NEW'),
            route: 'AccountOrderTracking',
            style: "info",
          };
      }
    };

    const state = stateToRender(order.state);
    return (
      <TouchableNativeFeedback
        onPress={() => navigate(state.route, { order: order.number })}>
        <HStack className="justify-between p-2">
          <VStack>
            <Text className="mb-2">
              {order.restaurant.name}
            </Text>
            <HStack space="md">
              <Text  style={{fontFamily: 'RobotoMono-Regular'}}>
                {order.number}
              </Text>
              <Badge action={state.style}>
                <BadgeText>{state.text}</BadgeText>
              </Badge>
            </HStack>
          </VStack>
          <Text>{formatPrice(order.total)}</Text>
        </HStack>
      </TouchableNativeFeedback>
    );
  }

  _renderSectionHeader(section) {
    return (
      <Heading size="sm" className="p-2">
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
