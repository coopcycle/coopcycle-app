import React, { Component } from 'react'
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../../utils/formatting'
import OrderNumber from '../../../components/OrderNumber'
import ItemSeparatorComponent from '../../../components/ItemSeparator'
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon'

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
  numberAndIcon: {
    flexDirection: 'row',
  },
  number: {
    marginRight: 10,
  },
})

class OrderList extends Component {

  renderItem(order) {
    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(order) }>
        <View style={ styles.numberAndIcon }>
          <View style={ styles.number }>
            <OrderNumber order={ order } />
          </View>
          <OrderFulfillmentMethodIcon order={ order } small />
        </View>
        <Text>{ `${formatPrice(order.itemsTotal)}` }</Text>
        <Text>{ moment.parseZone(order.pickupExpectedAt).format('LT') }</Text>
        <Icon style={{ color: '#ccc' }} name="ios-arrow-forward" />
      </TouchableOpacity>
    )
  }

  render() {

    const allOrders = [
      ...this.props.newOrders,
      ...this.props.acceptedOrders,
      ...this.props.cancelledOrders,
      ...this.props.fulfilledOrders,
    ]

    return (
      <SectionList
        data={ allOrders }
        keyExtractor={ (item, index) => item['@id'] }
        sections={[
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_NEW_ORDERS', { count: this.props.newOrders.length }),
            data: this.props.newOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_ACCEPTED_ORDERS', { count: this.props.acceptedOrders.length }),
            data: this.props.acceptedOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_CANCELLED_ORDERS', { count: this.props.cancelledOrders.length }),
            data: this.props.cancelledOrders,
          },
          {
            title: this.props.t('RESTAURANT_ORDER_LIST_FULFILLED_ORDERS', { count: this.props.fulfilledOrders.length }),
            data: this.props.fulfilledOrders,
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
