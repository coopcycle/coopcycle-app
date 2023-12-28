import React, { Component } from 'react'
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { HStack, Icon, Text } from 'native-base'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { formatPrice } from '../../../utils/formatting'
import OrderNumber from '../../../components/OrderNumber'
import ItemSeparatorComponent from '../../../components/ItemSeparator'
import OrderFulfillmentMethodIcon from '../../../components/OrderFulfillmentMethodIcon'
import { PaymentMethodInfo } from '../../../components/PaymentMethodInfo'

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
  },
  number: {
    marginRight: 10,
  },
})

class OrderList extends Component {

  renderItem(order) {
    return (
      <TouchableOpacity style={ styles.item } onPress={ () => this.props.onItemClick(order) }>
        <HStack alignItems="center">
          <View style={ styles.number }>
            <OrderNumber order={ order } />
          </View>
          <OrderFulfillmentMethodIcon order={ order } small />
          <PaymentMethodInfo fullDetail={false} paymentMethod={order.paymentMethod} />
          { order.notes ? <Icon as={FontAwesome} name="comments" size="xs"/> : null }
        </HStack>
        <Text>{ `${formatPrice(order.itemsTotal)}` }</Text>
        <Text>{ moment.parseZone(order.pickupExpectedAt).format('LT') }</Text>
        <Icon as={Ionicons} style={{ color: '#ccc' }} name="arrow-forward" />
      </TouchableOpacity>
    )
  }

  render() {

    const allOrders = [
      ...this.props.newOrders,
      ...this.props.acceptedOrders,
      ...this.props.pickedOrders,
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
            title: this.props.t('RESTAURANT_ORDER_LIST_PICKED_ORDERS', { count: this.props.pickedOrders.length }),
            data: this.props.pickedOrders,
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
