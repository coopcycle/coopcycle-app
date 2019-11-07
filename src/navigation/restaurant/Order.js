import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import {
  Container, Header, Title, Content, Footer,
  Left, Right, Body,
  Icon, Text, Button,
  Card, CardItem,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import moment from 'moment'
import { phonecall } from 'react-native-communications'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

import OrderItems from '../../components/OrderItems'
import { acceptOrder, setCurrentOrder } from '../../redux/Restaurant/actions'
import { printOrder } from '../../redux/App/actions'
import material from '../../../native-base-theme/variables/material'

const phoneNumberUtil = PhoneNumberUtil.getInstance()

class OrderScreen extends Component {

  componentDidFocus(payload) {
    this.props.setCurrentOrder(this.props.order)
  }

  componentWillBlur(payload) {
    this.props.setCurrentOrder(null)
  }

  _print() {
    const { order } = this.props
    this.props.printOrder(order)
  }

  renderButtons() {

    const { order } = this.props
    const { navigate } = this.props.navigation

    if (order.state === 'new') {
      return (
        <Footer style={{ backgroundColor: '#fbfbfb' }}>
          <Grid>
            <Row>
              <Col style={{ padding: 10 }}>
                <TouchableOpacity
                  style={ [ styles.footerBtn, styles.refuseBtn ] }
                  onPress={() => navigate('RestaurantOrderRefuse', { order })}>
                  <Text style={ styles.refuseBtnText }>
                    { this.props.t('RESTAURANT_ORDER_BUTTON_REFUSE') }
                  </Text>
                </TouchableOpacity>
              </Col>
              <Col style={{ padding: 10 }}>
                <TouchableOpacity
                  style={ [ styles.footerBtn, styles.acceptBtn ] }
                  onPress={() => this.props.acceptOrder(this.props.httpClient, order)}>
                  <Text style={ styles.acceptBtnText }>
                    { this.props.t('RESTAURANT_ORDER_BUTTON_ACCEPT') }
                  </Text>
                </TouchableOpacity>
              </Col>
            </Row>
          </Grid>
        </Footer>
      )
    }

    if (order.state === 'accepted') {
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
            </Row>
          </Grid>
        </Footer>
      )
    }
  }

  renderHeading() {

    const { order, thermalPrinterConnected } = this.props

    if (order.state !== 'refused' && order.state !== 'cancelled') {

      const preparationExpectedAt = moment.parseZone(order.preparationExpectedAt).format('LT')
      const pickupExpectedAt = moment.parseZone(order.pickupExpectedAt).format('LT')

      return (
        <Row size={ 2 }>
          <Col>
            <Row>
              <View style={ styles.dateContainer }>
                <Icon name="md-clock" />
                <Text>{ this.props.t('RESTAURANT_ORDER_PREPARATION_EXPECTED_AT', { date: preparationExpectedAt }) }</Text>
              </View>
            </Row>
            <Row>
              <View style={ styles.dateContainer }>
                <Icon name="md-bicycle" />
                <Text>{ this.props.t('RESTAURANT_ORDER_PICKUP_EXPECTED_AT', { date: pickupExpectedAt }) }</Text>
              </View>
            </Row>
            { thermalPrinterConnected && (
            <Row>
              <View style={ styles.dateContainer }>
                <Icon type="FontAwesome" name="print" />
                <Button onPress={ () => this._print() }>
                  <Text>{ this.props.t('RESTAURANT_ORDER_PRINT') }</Text>
                </Button>
              </View>
            </Row>
            )}
          </Col>
        </Row>
      )
    }
  }

  renderNotes() {

    const { order } = this.props

    if (order.notes) {
      return (
        <Card>
          <CardItem>
            <Left>
              <Icon name="quote" />
              <Text note>{ order.notes }</Text>
            </Left>
          </CardItem>
        </Card>
      )
    }
  }

  render() {

    const { order } = this.props

    let phoneNumber
    let isPhoneValid = false

    try {
      phoneNumber = phoneNumberUtil.parse(order.customer.telephone)
      isPhoneValid = true
    } catch (e) {}

    return (
      <Container>
        <NavigationEvents
          onDidFocus={ this.componentDidFocus.bind(this) }
          onWillBlur={ this.componentWillBlur.bind(this) } />
        <Grid>
          { this.renderHeading() }
          <Row size={ 10 }>
            <Content padder>
              { isPhoneValid && (
                <View style={ styles.section }>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Button iconLeft success
                      onPress={ () => phonecall(order.customer.telephone, true) }
                      style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
                      <Icon name="call" />
                      <Text>{ phoneNumberUtil.format(phoneNumber, PhoneNumberFormat.NATIONAL) }</Text>
                    </Button>
                  </View>
                </View>
              )}
              <View style={ styles.section }>
                <OrderItems order={ order } />
                { this.renderNotes() }
              </View>
            </Content>
          </Row>
        </Grid>
        { this.renderButtons() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
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
  delayBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: material.contentPadding,
  },
});

function mapStateToProps(state, ownProps) {
  return {
    httpClient: state.app.httpClient,
    order: state.restaurant.order || ownProps.navigation.state.params.order,
    thermalPrinterConnected: state.app.thermalPrinterConnected,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    acceptOrder: (client, order) => dispatch(acceptOrder(client, order)),
    setCurrentOrder: (order) => dispatch(setCurrentOrder(order)),
    printOrder: (order) => dispatch(printOrder(order)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderScreen))
