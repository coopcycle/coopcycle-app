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
import { phonecall } from 'react-native-communications'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { SwipeRow } from 'react-native-swipe-list-view'

import OrderItems from '../../components/OrderItems'
import OrderFulfillmentMethodIcon from '../../components/OrderFulfillmentMethodIcon'
import { acceptOrder, printOrder, fulfillOrder } from '../../redux/Restaurant/actions'
import material from '../../../native-base-theme/variables/material'
import { resolveFulfillmentMethod } from '../../utils/order'

const phoneNumberUtil = PhoneNumberUtil.getInstance()

const OrderButtons = ({ order, isPrinterConnected, t, onPrinterClick, printOrder }) => {

  let phoneNumber
  let isPhoneValid = false

  try {
    phoneNumber = phoneNumberUtil.parse(order.customer.telephone)
    isPhoneValid = true
  } catch (e) {}

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
      <View style={{ width: '50%', paddingRight: 5 }}>
        { isPrinterConnected && (
        <Button small iconRight onPress={ printOrder }>
          <Text>{ t('RESTAURANT_ORDER_PRINT') }</Text>
          <Icon type="FontAwesome" name="print" />
        </Button>
        )}
        { !isPrinterConnected && (
        <Button small light iconRight onPress={ onPrinterClick }>
          <Text>{ t('RESTAURANT_ORDER_PRINT') }</Text>
          <Icon type="FontAwesome" name="print" />
        </Button>
        )}
      </View>
      <View style={{ width: '50%', paddingLeft: 5 }}>
        { isPhoneValid && (
        <Button small iconLeft success
          onPress={ () => phonecall(order.customer.telephone, true) }>
          <Icon name="call" />
          <Text>{ phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL) }</Text>
        </Button>
        )}
      </View>
    </View>
  )
}

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

  constructor(props) {
    super(props)
    this.state = {
      openValue: 0,
    }
    this.onSwipeValueChange = this.onSwipeValueChange.bind(this)
    this.onRowOpen = this.onRowOpen.bind(this)
    this.swipeRow = React.createRef()
  }

  renderActionButtons() {

    const { order } = this.props
    const { navigate } = this.props.navigation

    if (order.state === 'new') {
      return (
        <View style={{ backgroundColor: '#efefef' }}>
          <View style={{ padding: 20 }} onLayout={ event => this.setState({ openValue: (event.nativeEvent.layout.width * 0.7) }) }>
            <SwipeRow
              leftOpenValue={ this.state.openValue }
              rightOpenValue={ (this.state.openValue * -1) }
              onRowOpen={ this.onRowOpen }
              onSwipeValueChange={ this.onSwipeValueChange }
              ref={ this.swipeRow }>
              <View style={ styles.swipeBg }>
                <Text>{ this.props.t('RESTAURANT_ORDER_BUTTON_ACCEPT') }</Text>
                <Text>{ this.props.t('RESTAURANT_ORDER_BUTTON_REFUSE') }</Text>
              </View>
              <View style={ styles.swipeFg }>
                <Icon type="FontAwesome" name="angle-double-left" />
                <Icon type="FontAwesome" name="angle-double-right" />
              </View>
            </SwipeRow>
          </View>
          <Text note style={{ textAlign: 'center', marginBottom: 20 }}>{ this.props.t('SWIPE_TO_ACCEPT_REFUSE') }</Text>
        </View>
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

  onSwipeValueChange({ key, value }) {
    // TODO Animate color
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
  acceptBtn: {
     borderColor: material.brandSuccess,
  },
  acceptBtnText: {
    color: material.brandSuccess,
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
  swipeBg: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    paddingHorizontal: 30,
  },
  swipeFg: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 3,
    borderColor: '#e7e7e7',
    backgroundColor: '#ffffff',
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
