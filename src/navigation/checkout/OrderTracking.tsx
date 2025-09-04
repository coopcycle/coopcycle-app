import { find } from 'lodash';
import moment from 'moment';
import { Icon, HelpCircleIcon } from '@/components/ui/icon';
import { Clock, MapPin, Tag } from 'lucide-react-native'
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { RefreshControl, StyleSheet, View, ScrollView } from 'react-native';
import { phonecall } from 'react-native-communications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Markdown from '../../components/Markdown';
import i18n from '../../i18n';
import {
  loadOrder,
  subscribe,
  unsubscribe,
  updateOrderSuccess,
} from '../../redux/Account/actions';
import { deleteCart } from '../../redux/Checkout/actions';
import { primaryColor } from '../../styles/common';
import Step from './components/Step';
import { selectUser } from '../../redux/App/selectors';

export function orderToStep(order) {
  const eventType = [
    'order:created',
    'order:accepted',
    'order:picked',
    'order:refused',
    'order:cancelled',
    'order:fulfilled',
  ];

  let index = 0;
  let error = 0;
  let legacy = false;
  let events = [];

  // TODO: Remove legacy if all servers are >= coopcycle/coopcycle-web#f4031d3
  if (Object.prototype.hasOwnProperty.call(order, 'events')) {
    events = order.events
      .filter(event => eventType.includes(event.type))
      .sort((a, b) => {
        return eventType.indexOf(a.type) - eventType.indexOf(b.type);
      });
  } else {
    events = [{ type: 'order:' + order.state }];
    legacy = true;
  }

  events.forEach(event => {
    switch (event.type) {
      case 'order:accepted':
        index = 1;
        break;
      case 'order:picked':
        index = 2;
        break;
      case 'order:fulfilled':
        index = 3;
        break;
      case 'order:refused':
        index = 1;
        error = 1;
        break;
      case 'order:cancelled':
        index = 2;
        error = 2;
        break;
    }
  });

  return { index, error, legacy };
}

const stateDescription = [
  i18n.t('ORDER_TIMELINE_AFTER_CREATED_DESCRIPTION'),
  i18n.t('ORDER_TIMELINE_AFTER_ACCEPTED_DESCRIPTION'),
  i18n.t('ORDER_TIMELINE_AFTER_PICKED_DESCRIPTION'),
];

class OrderTrackingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentWillUnmount() {
    const { order } = this.props;
    if (order) {
      this.props.unsubscribe(order);
      clearInterval(this.interval);
    }
  }

  componentDidMount() {
    const { order } = this.props;
    if (order) {
      this.props.subscribe(order, event => {
        switch (event.name) {
          case 'order:accepted':
          case 'order:picked':
          case 'order:fulfilled':
          case 'order:cancelled':
          case 'order:refused':
          case 'order:delayed':
            this.props.updateOrder(event.data.order);
        }
      });
      this.interval = setInterval(() => this._refresh(), 60000);
    }
  }

  _refresh() {
    this.setState({ refreshing: true });
    this.props.loadOrder(this.props.order, () =>
      this.setState({ refreshing: false }),
    );
  }

  render() {
    const { order, orderConfirmMessage } = this.props;
    const timeRange = [
      moment(order.shippingTimeRange[0]).format('HH:mm'),
      moment(order.shippingTimeRange[1]).format('HH:mm'),
    ];

    const step = orderToStep(order);
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this._refresh()}
          />
        }>
        <View testID="orderTimeline" style={styles.tracker}>
          <Text style={styles.trackerLabel}>
            {i18n.t('ORDER_ETA', { start: timeRange[0], end: timeRange[1] })}
          </Text>
          <View padding={3}>
            <Step
              activeLabel={i18n.t('ORDER_TIMELINE_CREATED_TITLE')}
              start
              active={step.index >= 0}
            />
            <Step
              loadingLabel={i18n.t('ORDER_TIMELINE_AFTER_CREATED_TITLE')}
              activeLabel={i18n.t('ORDER_TIMELINE_ACCEPTED_TITLE')}
              errorLabel={i18n.t('ORDER_TIMELINE_REFUSED_TITLE')}
              loading={step.index === 0 && step.error === 0}
              active={step.index >= 1}
              error={step.error === 1}
              hide={!!step.error && step.error < 1}
            />
            <Step
              loadingLabel={i18n.t('ORDER_TIMELINE_AFTER_ACCEPTED_TITLE')}
              activeLabel={i18n.t('ORDER_TIMELINE_PICKED_TITLE')}
              errorLabel={i18n.t('ORDER_TIMELINE_CANCELLED_TITLE')}
              loading={step.index === 1 && step.error === 0}
              active={step.index >= 2}
              error={step.error === 2}
              hide={
                (!!step.error && step.error < 2) ||
                (step.legacy && step.error !== 2)
              }
            />
            <Step
              loadingLabel={i18n.t('ORDER_TIMELINE_AFTER_PICKED_TITLE')}
              activeLabel={i18n.t('ORDER_TIMELINE_DROPPED_TITLE')}
              loading={step.index === 2 && step.error === 0}
              active={step.index >= 3}
              error={step.error === 3}
              hide={!!step.error && step.error < 3}
            />
          </View>
          {!step.error && step.index <= 2 && (
            <Text style={styles.trackerDescription}>
              {stateDescription[step.index]}
            </Text>
          )}
        </View>

        <View style={styles.tracker}>
          <Text style={styles.trackerLabel}>{i18n.t('ORDER_ABOUT')}</Text>
          <HStack className="p-2" space="md">
            <Icon
              as={Tag}
            />
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 18,
                fontFamily: 'RobotoMono-Regular',
              }}>
              {order.number}
            </Text>
          </HStack>
          <HStack className="p-2" space="md">
            <Icon
              as={MapPin}
              color={'blueGray.600'}
            />
            <Text style={{ textAlign: 'center', lineHeight: 18 }}>
              {order.shippingAddress?.streetAddress ||
                i18n.t('FULFILLMENT_METHOD.collection')}
            </Text>
          </HStack>
          <HStack className="p-2" space="md">
            <Icon
              as={Clock}
            />
            <Text style={{ textAlign: 'center', lineHeight: 18 }}>
              {moment(order.shippedAt).format('ll')} {timeRange[0]} -{' '}
              {timeRange[1]}
            </Text>
          </HStack>
        </View>

        {orderConfirmMessage ? (
          <View style={styles.tracker} p="2">
            <Markdown>{orderConfirmMessage}</Markdown>
          </View>
        ) : null}

        <View
          style={{
            width: '100%',
            padding: 5,
            marginBottom: 20,
          }}>
          <Button
            className="mb-4"
            onPress={() =>
              this.props.navigation.navigate('AccountOrder', {
                order: order.number,
              })
            }>
            <ButtonText>{i18n.t('SHOW_ORDER_DETAILS')}</ButtonText>
          </Button>
          <Button
            onPress={() => phonecall(this.props.phoneNumber, true)}
            variant="link">
            <ButtonIcon as={HelpCircleIcon} />
            <ButtonText>{i18n.t('HELP')}</ButtonText>
          </Button>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  tracker: {
    borderWidth: 1,
    borderColor: primaryColor + '9c',
    margin: 10,
    borderRadius: 2,
  },
  trackerLabel: {
    width: '100%',
    height: 35,
    lineHeight: 35,
    paddingLeft: 5,
    backgroundColor: primaryColor + '2a',
    fontSize: 16,
  },
  trackerDescription: {
    width: '100%',
    padding: 5,
    backgroundColor: primaryColor + '10',
  },
});

function mapStateToProps(state, ownProps) {
  return {
    order: find(
      state.account.orders,
      o => o.number === ownProps.route.params.order,
    ),
    user: selectUser(state),
    phoneNumber: state.app.settings.phone_number,
    loading: state.app.loading,
    orderConfirmMessage: state.app.settings.order_confirm_message,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subscribe: (order, onMessage) => dispatch(subscribe(order, onMessage)),
    unsubscribe: order => dispatch(unsubscribe(order)),
    deleteCart: id => dispatch(deleteCart(id)),
    loadOrder: (order, cb) => dispatch(loadOrder(order, cb)),
    updateOrder: order => dispatch(updateOrderSuccess(order)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(OrderTrackingPage));
