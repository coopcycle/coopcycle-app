import React, { Component } from 'react';
import { View } from 'react-native';
import {
  Container,
  Left,
  Icon, Text, Button,
  Card, CardItem,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import OrderItems from '../../components/OrderItems'
import SwipeToAcceptOrRefuse from './components/SwipeToAcceptOrRefuse'
import OrderHeading from './components/OrderHeading'
import OrderAcceptedFooter from './components/OrderAcceptedFooter'

import { acceptOrder, printOrder, fulfillOrder } from '../../redux/Restaurant/actions'

const OrderNotes = ({ order }) => {

  if (order.notes) {

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <Card>
          <CardItem>
            <Left>
              <Icon type="FontAwesome" name="quote-left" />
              <Text note>{ order.notes }</Text>
            </Left>
          </CardItem>
        </Card>
      </View>
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

    return (
      <Container style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1 }}>
          <OrderHeading
            order={ order }
            isPrinterConnected={ this.props.isPrinterConnected }
            onPrinterClick={ () => this.props.navigation.navigate('RestaurantPrinter') }
            printOrder={ () => this.props.printOrder(this.props.order) } />
          <OrderItems order={ order } />
          <OrderNotes order={ order } />
        </View>
        { order.state === 'new' &&
          <SwipeToAcceptOrRefuse
            onAccept={ () => this.props.acceptOrder(order, order => this.props.navigation.setParams({ order })) }
            onRefuse={ () => this.props.navigation.navigate('RestaurantOrderRefuse', { order }) } />
        }
        { order.state === 'accepted' &&
          <OrderAcceptedFooter
            order={ order }
            onPressCancel={  () => this.props.navigation.navigate('RestaurantOrderCancel', { order }) }
            onPressDelay={   () => this.props.navigation.navigate('RestaurantOrderDelay', { order }) }
            onPressFulfill={ () => this.fulfillOrder(order) } />
        }
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {

  return {
    order: ownProps.navigation.getParam('order'),
    isPrinterConnected: !!state.restaurant.printer,
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderScreen))
