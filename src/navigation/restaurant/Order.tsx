import { Icon } from '@/components/ui/icon';
import { TriangleAlert } from 'lucide-react-native'
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import OrderItems from '../../components/OrderItems';
import OrderAcceptedFooter from './components/OrderAcceptedFooter';
import OrderHeading from './components/OrderHeading';
import SwipeToAcceptOrRefuse from './components/SwipeToAcceptOrRefuse';

import {
  acceptOrder,
  fulfillOrder,
  printOrder,
} from '../../redux/Restaurant/actions';
import { isMultiVendor } from '../../utils/order';
import {
  selectIsPrinterConnected,
  selectIsPrinting,
  selectPrinter,
} from '../../redux/Restaurant/selectors';
import { DatadogLogger } from '../../Datadog';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';

const OrderNotes = ({ order }) => {
  if (order.notes) {
    return (
      <HStack className="p-2 items-center">
        <Icon as={TriangleAlert} size="xl" className="mr-2" />
        <Text>{order.notes}</Text>
      </HStack>
    );
  }

  return null;
};

class OrderScreen extends Component {
  fulfillOrder(order) {
    this.props.fulfillOrder(order, o =>
      this.props.navigation.setParams({ order: o }),
    );
  }

  render() {
    const { order } = this.props;

    const canEdit = !isMultiVendor(order);

    return (
      <BasicSafeAreaView>
        <View style={{ flex: 1 }}>
          <OrderHeading
            order={order}
            isPrinterConnected={this.props.isPrinterConnected}
            onPrinterClick={() =>
              this.props.navigation.navigate('RestaurantSettings', {
                screen: 'RestaurantPrinter',
              })
            }
            printOrder={() => {
              DatadogLogger.info('printing ticket', {
                trigger: 'manual',
                orderId: order.id,
                restaurantId: order.restaurant.id,
              });
              this.props.printOrder(order);
            }}
            disablePrintButton={this.props.isPrinting}
          />
          <OrderNotes order={order} />
          <OrderItems order={order} />
        </View>
        {order.reusablePackagingEnabled && order.restaurant.loopeatEnabled && (
          <Box className="p-3">
            <Button
              variant="outline"
              onPress={() =>
                this.props.navigation.navigate('RestaurantLoopeatFormats', {
                  order,
                })
              }>
              <ButtonText>{this.props.t('RESTAURANT_LOOPEAT_UPDATE_FORMATS')}</ButtonText>
            </Button>
          </Box>
        )}
        {canEdit && order.state === 'new' && (
          <SwipeToAcceptOrRefuse
            onAccept={() =>
              this.props.acceptOrder(order, o =>
                this.props.navigation.setParams({ order: o }),
              )
            }
            onRefuse={() =>
              this.props.navigation.navigate('RestaurantOrderRefuse', { order })
            }
          />
        )}
        {canEdit &&
          (order.state === 'accepted' ||
            order.state === 'started' ||
            order.state === 'ready') && (
            <OrderAcceptedFooter
              order={order}
              onPressCancel={() =>
                this.props.navigation.navigate('RestaurantOrderCancel', {
                  order,
                })
              }
              onPressDelay={() =>
                this.props.navigation.navigate('RestaurantOrderDelay', {
                  order,
                })
              }
              onPressFulfill={() => this.fulfillOrder(order)}
            />
          )}
      </BasicSafeAreaView>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    order: ownProps.route.params?.order,
    isPrinterConnected: selectIsPrinterConnected(state),
    printer: selectPrinter(state),
    isPrinting: selectIsPrinting(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    acceptOrder: (order, cb) => dispatch(acceptOrder(order, cb)),
    printOrder: order => dispatch(printOrder(order)),
    fulfillOrder: (order, cb) => dispatch(fulfillOrder(order, cb)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(OrderScreen));
