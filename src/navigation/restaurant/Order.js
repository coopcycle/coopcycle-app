import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  Container,
  Footer,
  Left,
  Icon, Text, Button,
  Card, CardItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import moment from 'moment'

import OrderItems from '../../components/OrderItems'
import OrderFulfillmentMethodIcon from '../../components/OrderFulfillmentMethodIcon'
import OrderButtons from './components/OrderButtons'
import SwipeToAcceptOrRefuse from './components/SwipeToAcceptOrRefuse'

import { acceptOrder, printOrder, fulfillOrder } from '../../redux/Restaurant/actions'
import material from '../../../native-base-theme/variables/material'
import { resolveFulfillmentMethod } from '../../utils/order'

const fallbackFormat = 'dddd D MMM'

const OrderHeading = ({ order, isPrinterConnected, t, onPrinterClick, printOrder }) => {

  if (order.state !== 'refused' && order.state !== 'cancelled') {

    const preparationExpectedAt = moment.parseZone(order.preparationExpectedAt)
    const pickupExpectedAt = moment.parseZone(order.pickupExpectedAt)

    return (
      <View style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#CCCCCC' }}>
        <View style={ styles.fulfillment }>
          <OrderFulfillmentMethodIcon order={ order } />
          <Text style={{ fontWeight: '700' }}>{ moment(pickupExpectedAt).calendar(null, {
            lastDay : fallbackFormat,
            sameDay: `[${t('TODAY')}]`,
            nextDay: `[${t('TOMORROW')}]`,
            lastWeek : fallbackFormat,
            nextWeek : fallbackFormat,
            sameElse : fallbackFormat,
          }) }</Text>
          <Text>{ t(`FULFILLMENT_METHOD.${resolveFulfillmentMethod(order)}`) }</Text>
        </View>
        <View style={ styles.timeline }>
          <Icon type="FontAwesome" name="clock-o" />
          <View style={{ alignItems: 'flex-end' }}>
            <Text>{ t('RESTAURANT_ORDER_PREPARATION_EXPECTED_AT', { date: preparationExpectedAt.format('LT') }) }</Text>
            <Text>{ t('RESTAURANT_ORDER_PICKUP_EXPECTED_AT', { date: pickupExpectedAt.format('LT') }) }</Text>
          </View>
        </View>
        <View style={{ marginBottom: 15 }}>
          <OrderButtons
            order={ order }
            isPrinterConnected={ isPrinterConnected }
            onPrinterClick={ onPrinterClick }
            printOrder={ printOrder }
            t={ t } />
        </View>
      </View>
    )
  }
}

class OrderScreen extends Component {

  renderActionButtons() {

    const { order } = this.props
    const { navigate } = this.props.navigation

    if (order.state === 'new') {

      return (
        <SwipeToAcceptOrRefuse
          onAccept={ () => this.props.acceptOrder(this.props.order, order => this.props.navigation.setParams({ order })) }
          onRefuse={ () => this.props.navigation.navigate('RestaurantOrderRefuse', { order: this.props.order }) } />
      )
    }

    if (order.state === 'accepted') {

      const fulfillmentMethod = resolveFulfillmentMethod(order)

      return (
        <Footer style={{ backgroundColor: '#fbfbfb' }}>
          <Grid>
            <Row>
              <Col style={{ padding: 10 }}>
                <TouchableOpacity
                  style={ [ styles.footerBtn, styles.refuseBtn ] }
                  onPress={() => navigate('RestaurantOrderCancel', { order })}>
                  <Text style={ styles.refuseBtnText }>
                    { this.props.t('RESTAURANT_ORDER_BUTTON_CANCEL') }
                  </Text>
                </TouchableOpacity>
              </Col>
              <Col style={{ padding: 10 }}>
                <TouchableOpacity
                  style={ [ styles.footerBtn, styles.delayBtn ] }
                  onPress={() => navigate('RestaurantOrderDelay', { order })}>
                  <Text style={ styles.delayBtnText }>
                    { this.props.t('RESTAURANT_ORDER_BUTTON_DELAY') }
                  </Text>
                </TouchableOpacity>
              </Col>
              { fulfillmentMethod === 'collection' && (
              <Col style={{ padding: 10 }}>
                <TouchableOpacity
                  style={ [ styles.footerBtn, styles.fulfillBtn ] }
                  onPress={() => this.fulfillOrder(order) }>
                  <Text style={ styles.fulfillBtnText }>
                    { this.props.t('RESTAURANT_ORDER_BUTTON_FULFILL') }
                  </Text>
                </TouchableOpacity>
              </Col>
              )}
            </Row>
          </Grid>
        </Footer>
      )
    }
  }

  renderNotes() {

    const { order } = this.props

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
  }

  fulfillOrder(order) {
    this.props.fulfillOrder(order, o => this.props.navigation.setParams({ order: o }))
  }

  onRowOpen(value) {
    if (value > 0) {
      this.props.acceptOrder(this.props.order, order => this.props.navigation.setParams({ order }))
    } else {
      this.props.navigation.navigate('RestaurantOrderRefuse', { order: this.props.order })
    }
    setTimeout(() => this.swipeRow.current.closeRow(), 250)
  }

  render() {

    const { order } = this.props

    return (
      <Container style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ flex: 1 }}>
          <OrderHeading
            order={ order }
            t={ this.props.t }
            isPrinterConnected={ this.props.isPrinterConnected }
            onPrinterClick={ () => this.props.navigation.navigate('RestaurantPrinter') }
            printOrder={ () => this.props.printOrder(this.props.order) } />
          <OrderItems order={ order } />
          { this.renderNotes() }
        </View>
        { this.renderActionButtons() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  refuseBtn: {
    borderColor: material.brandDanger,
  },
  refuseBtnText: {
    color: material.brandDanger,
    fontWeight: 'bold',
  },
  delayBtn: {
    borderColor: '#333',
  },
  fulfillBtn: {
    borderColor: material.brandSuccess,
  },
  delayBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  fulfillBtnText: {
    color: material.brandSuccess,
    fontWeight: 'bold',
  },
  fulfillment: {
    backgroundColor: '#f9ca24',
    paddingHorizontal: material.contentPadding,
    paddingVertical: (material.contentPadding * 1.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: material.contentPadding,
    marginBottom: 10,
  },
});

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
