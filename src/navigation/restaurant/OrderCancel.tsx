import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { cancelOrder } from '../../redux/Restaurant/actions';
import { resolveFulfillmentMethod } from '../../utils/order';
import BigButton from './components/BigButton';

class OrderCancelScreen extends Component {
  _cancelOrder(reason) {
    this.props.cancelOrder(this.props.route.params?.order, reason, order =>
      this.props.navigation.navigate('RestaurantOrder', { order }),
    );
  }

  render() {
    const order = this.props.route.params?.order;
    const fulfillmentMethod = resolveFulfillmentMethod(order);

    return (
      <Center flex={1}>
        <View style={{ padding: 20 }}>
          <Text note>{this.props.t('RESTAURANT_ORDER_CANCEL_DISCLAIMER')}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <BigButton
            heading={this.props.t(
              'RESTAURANT_ORDER_CANCEL_REASON_CUSTOMER_HEADING',
            )}
            text={`${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED',
            )}\n${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING',
            )}`}
            onPress={() => this._cancelOrder('CUSTOMER')}
          />
          <BigButton
            heading={this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_SOLD_OUT_HEADING',
            )}
            text={`${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED',
            )}\n${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING',
            )}`}
            onPress={() => this._cancelOrder('SOLD_OUT')}
          />
          <BigButton
            heading={this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_RUSH_HOUR_HEADING',
            )}
            text={`${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED',
            )}\n${this.props.t(
              'RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING',
            )}`}
            onPress={() => this._cancelOrder('RUSH_HOUR')}
          />
          {fulfillmentMethod === 'collection' && (
            <BigButton
              danger
              heading={this.props.t('RESTAURANT_ORDER_REFUSE_REASON_NO_SHOW')}
              text={this.props.t(
                'RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_CAPTURED',
              )}
              onPress={() => this._cancelOrder('NO_SHOW')}
            />
          )}
        </View>
      </Center>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    cancelOrder: (order, reason, cb) =>
      dispatch(cancelOrder(order, reason, cb)),
  };
}

export default connect(
  () => ({}),
  mapDispatchToProps,
)(withTranslation()(OrderCancelScreen));
