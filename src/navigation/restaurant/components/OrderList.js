import React, { Component } from 'react'
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../../utils/formatting'
import OrderNumber from '../../../components/OrderNumber'
import ItemSeparatorComponent from '../../../components/ItemSeparator'

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#efefef',
  },
})

class OrderList extends Component {

  renderItem(order) {
    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(order) }>
        <OrderNumber order={ order } />
        <Text>{ `${formatPrice(order.itemsTotal)}` }</Text>
        <Text>{ moment.parseZone(order.preparationExpectedAt).format('LT') }</Text>
        <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
      </TouchableOpacity>
    )
  }

  render() {

    const ordersByState = _.groupBy(this.props.orders, 'state')

    let newOrders = ordersByState.hasOwnProperty('new') ? ordersByState.new : []
    let acceptedOrders = ordersByState.hasOwnProperty('accepted') ? ordersByState.accepted : []
    let fulfilledOrders = ordersByState.hasOwnProperty('fulfilled') ? ordersByState.fulfilled : []

    let refusedOrders = ordersByState.hasOwnProperty('refused') ? ordersByState.refused : []
    let cancelledOrders = ordersByState.hasOwnProperty('cancelled') ? ordersByState.cancelled : []
    let allCancelledOrders = cancelledOrders.concat(refusedOrders)

    newOrders = _.sortBy(newOrders, [ order => moment.parseZone(order.preparationExpectedAt) ])
    acceptedOrders = _.sortBy(acceptedOrders, [ order => moment.parseZone(order.preparationExpectedAt) ])
    allCancelledOrders = _.sortBy(allCancelledOrders, [ order => moment.parseZone(order.shippedAt) ])

    return (
      <SectionList
        data={ this.props.orders }
        keyExtractor={ (item, index) => item['@id'] }
        sections={[
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_NEW_ORDERS', { count: newOrders.length }),
            data: newOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_ACCEPTED_ORDERS', { count: acceptedOrders.length }),
            data: acceptedOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_CANCELLED_ORDERS', { count: allCancelledOrders.length }),
            data: allCancelledOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_FULFILLED_ORDERS', { count: fulfilledOrders.length }),
            data: fulfilledOrders,
          },
        ]}
        renderSectionHeader={ ({ section: { title } } ) => (
          <View style={ styles.sectionHeader }>
            <Text style={{ fontWeight: 'bold' }}>{title}</Text>
          </View>
        )}
        renderItem={ ({ item }) => this.renderItem(item) }
        ItemSeparatorComponent={ ItemSeparatorComponent } />
    )
  }
}

export default withTranslation()(OrderList)
