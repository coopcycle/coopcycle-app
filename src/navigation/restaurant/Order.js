import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Icon, Text,
  Box, HStack,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import OrderItems from '../../components/OrderItems'
import SwipeToAcceptOrRefuse from './components/SwipeToAcceptOrRefuse'
import OrderHeading from './components/OrderHeading'
import OrderAcceptedFooter from './components/OrderAcceptedFooter'

import { acceptOrder, printOrder, fulfillOrder } from '../../redux/Restaurant/actions'
import { isMultiVendor } from '../../utils/order'

const OrderNotes = ({ order }) => {

  if (order.notes) {

    return (
      <HStack p="2" alignItems="center">
        <Icon as={FontAwesome} size="sm" name="exclamation-triangle" mr="2" />
        <Text>{ order.notes }</Text>
      </HStack>
    )
  }

  return null
}

class OrderScreen extends Component {

  fulfillOrder(order) {
    this.props.fulfillOrder(order, o => this.props.navigation.setParams({ order: o }))
  }

  render() {

    const { order } = this.props

    const canEdit = !isMultiVendor(order)

    return (
      <Box flex={1}>
        <View style={{ flex: 1 }}>
          <OrderHeading
            order={ order }
            isPrinterConnected={ this.props.isPrinterConnected }
            onPrinterClick={ () => this.props.navigation.navigate('RestaurantSettings', { screen: 'RestaurantPrinter' }) }
            printOrder={ () => this.props.printOrder(this.props.order) } />
          <OrderNotes order={ order } />
          <OrderItems order={ order } />
        </View>
        { (canEdit && order.state === 'new') &&
          <SwipeToAcceptOrRefuse
            onAccept={ () => this.props.acceptOrder(order, o => this.props.navigation.setParams({ order: o })) }
            onRefuse={ () => this.props.navigation.navigate('RestaurantOrderRefuse', { order }) } />
        }
        { (canEdit && order.state === 'accepted') &&
          <OrderAcceptedFooter
            order={ order }
            onPressCancel={  () => this.props.navigation.navigate('RestaurantOrderCancel', { order }) }
            onPressDelay={   () => this.props.navigation.navigate('RestaurantOrderDelay', { order }) }
            onPressFulfill={ () => this.fulfillOrder(order) } />
        }
      </Box>
    )
  }
}

function mapStateToProps(state, ownProps) {

  return {
    order: ownProps.route.params?.order,
    isPrinterConnected: !!state.restaurant.printer || state.restaurant.isSunmiPrinter,
    printer: state.restaurant.printer,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    acceptOrder: (order, cb) => dispatch(acceptOrder(order, cb)),
    printOrder: (order) => dispatch(printOrder(order)),
    fulfillOrder: (order, cb) => dispatch(fulfillOrder(order, cb)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderScreen))
