import React, { Component } from 'react'
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import slugify from 'slugify'
import moment from 'moment/min/moment-with-locales'
import _ from 'lodash'
import { translate } from 'react-i18next'
import { localeDetector } from '../../../i18n'
import { formatPrice } from '../../../Cart'

moment.locale(localeDetector())

const styles = StyleSheet.create({
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemLeftRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  col: {
    justifyContent: 'center',
  },
  restaurantNameText: {
    marginBottom: 5
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#efefef'
  }
});

class OrderList extends Component {

  renderItem(order) {
    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(order) }>
        <Grid>
          <Col size={ 2 } style={ styles.col }>
            <Text>{ `#${order.id}` }</Text>
          </Col>
          <Col size={ 4 } style={ styles.col }>
            <Text>{ `${formatPrice(order.total)} €` }</Text>
          </Col>
          <Col size={ 4 } style={ styles.col }>
            <Text>{ moment(order.preparationExpectedAt).format('LT') }</Text>
          </Col>
          <Col size={ 1 } style={ styles.itemLeftRight }>
            <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    const ordersByState = _.groupBy(this.props.orders, 'state')

    let newOrders = ordersByState.hasOwnProperty('new') ? ordersByState['new'] : []
    let acceptedOrders = ordersByState.hasOwnProperty('accepted') ? ordersByState['accepted'] : []
    let fulfilledOrders = ordersByState.hasOwnProperty('fulfilled') ? ordersByState['fulfilled'] : []

    let refusedOrders = ordersByState.hasOwnProperty('refused') ? ordersByState['refused'] : []
    let cancelledOrders = ordersByState.hasOwnProperty('cancelled') ? ordersByState['cancelled'] : []
    let allCancelledOrders = cancelledOrders.concat(refusedOrders)

    newOrders = _.sortBy(newOrders, [ order => moment(order.preparationExpectedAt) ])
    acceptedOrders = _.sortBy(acceptedOrders, [ order => moment(order.preparationExpectedAt) ])
    allCancelledOrders = _.sortBy(allCancelledOrders, [ order => moment(order.shippedAt) ])

    return (
      <SectionList
        data={ this.props.orders }
        keyExtractor={ (item, index) => item['@id'] }
        sections={[
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_NEW_ORDERS', { count: newOrders.length }),
            data: newOrders
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_ACCEPTED_ORDERS', { count: acceptedOrders.length }),
            data: acceptedOrders
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_CANCELLED_ORDERS', { count: allCancelledOrders.length }),
            data: allCancelledOrders
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_FULFILLED_ORDERS', { count: fulfilledOrders.length }),
            data: fulfilledOrders
          },
        ]}
        renderSectionHeader={ ({ section: { title } } ) => (
          <View style={ styles.sectionHeader }>
            <Text style={{ fontWeight: 'bold' }}>{title}</Text>
          </View>
        )}
        renderItem={ ({ item }) => this.renderItem(item) } />
    )
  }
}

export default translate()(OrderList)
