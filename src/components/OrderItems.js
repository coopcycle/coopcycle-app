import React, { Component } from 'react'
import { FlatList, SectionList, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { Box, HStack, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../utils/formatting'
import _ from 'lodash'

import ItemSeparator from './ItemSeparator'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adjustmentText: {
    fontSize: 14,
    color: '#999',
  },
  itemQuantity: {
    fontWeight: '600',
    fontSize: 15 * 1.2,
  },
  textHighlight: {
    color: '#FF851B',
  },
});

const CartLine = (props) => {

  return (
    <HStack p="2" justifyContent="space-between">
      <Text bold>{ props.label }</Text>
      <Text bold>{ props.value }</Text>
    </HStack>
  )
}

const SectionHeader = ({ section: { title } }) => (
  <Text style={{ paddingHorizontal: 15, paddingVertical: 10, fontWeight: '700', color: '#c7c7c7' }}>{title}</Text>
)

const itemsToSections = (itemsGroupedByVendor) =>
  _.map(itemsGroupedByVendor, (items) => ({
    title: items[0].vendor.name,
    data: items,
  }))

class OrderItems extends Component {

  renderItemAdjustments(adjustments, important = false) {

    const textStyle = [styles.adjustmentText]
    if (important) {
      textStyle.push(styles.textHighlight)
    }

    return (
      <View>
        { adjustments.map(adjustment => (
          <Text style={ textStyle } key={ `ADJUSTMENT#${adjustment.id}` }>
            { adjustment.label }
          </Text>
        )) }
      </View>
    )
  }

  renderItem(item) {

    const itemQuantityStyle = [styles.itemQuantity]
    if (item.quantity > 1) {
      itemQuantityStyle.push(styles.textHighlight)
    }

    return (
      <HStack p="2" justifyContent="space-between">
        <Box w="15%">
          <Text style={ itemQuantityStyle }>{ `${item.quantity} ×` }</Text>
        </Box>
        <Box w="70%">
          <Text>{ item.name }</Text>
          { (item.adjustments && item.adjustments.hasOwnProperty('menu_item_modifier')) &&
            this.renderItemAdjustments(item.adjustments.menu_item_modifier) }
          { (item.adjustments && item.adjustments.hasOwnProperty('reusable_packaging')) &&
            this.renderItemAdjustments(item.adjustments.reusable_packaging, true) }
        </Box>
        <Box w="15%" alignItems="flex-end">
          <Text>{ `${formatPrice(item.total)}` }</Text>
        </Box>
      </HStack>
    )
  }

  _deliveryTotal(order) {
    if (!order.adjustments) {
        return 0
    }

    if (!order.adjustments.hasOwnProperty('delivery')) {
      return 0
    }

    return _.reduce(order.adjustments.delivery, function(total, adj) {
      return total + adj.amount
    }, 0)
  }

  renderAdjustments() {

    return <>
      <CartLine
        label={ this.props.t('TOTAL_DELIVERY') }
        value={ `${formatPrice(this._deliveryTotal(this.props.order))}` } />
      <CartLine
        label={ this.props.t('TIP') }
        value={ `${formatPrice(this.props.order.adjustments.tip[0]?.amount || 0)}` } />
    </>
  }

  renderItemsTotal() {

    return (
      <CartLine
        label={ this.props.t('TOTAL_ITEMS') }
        value={ `${formatPrice(this.props.order.itemsTotal)}` } />
    )
  }

  renderTotal() {

    return (
      <CartLine
        label={ this.props.t('TOTAL') }
        value={ `${formatPrice(this.props.order.total)}` } />
    )
  }

  render() {

    const { order } = this.props

    const itemsGroupedByVendor = _.groupBy(order.items, 'vendor.@id')
    const isMultiVendor = _.size(itemsGroupedByVendor) > 1

    const items = isMultiVendor ?
      itemsToSections(itemsGroupedByVendor) : order.items

    return (
      <View style={ styles.container }>
        <View style={{ flex: 1 }}>
          { isMultiVendor && (
            <SectionList
              sections={ items }
              keyExtractor={ (item, index) => `ITEM#${item.id}` }
              renderItem={ ({ item }) => this.renderItem(item) }
              renderSectionHeader={ SectionHeader } />
          )}
          { !isMultiVendor && (
            <FlatList
              data={ items }
              keyExtractor={ (item, index) => `ITEM#${item.id}` }
              renderItem={ ({ item }) => this.renderItem(item) }
              ItemSeparatorComponent={ ItemSeparator } />
          )}
        </View>
        {this.props.withTotals && <View style={{ flex: 0, flexShrink: 1 }}>
          { this.renderItemsTotal() }
          { this.props.withDeliveryTotal === true && this.renderAdjustments() }
          { this.props.withDeliveryTotal === true && this.renderTotal() }
        </View>}
      </View>
    )
  }
}

OrderItems.defaultProps = {
  withDeliveryTotal: false,
  withTotals: true,
}

OrderItems.propTypes = {
  withDeliveryTotal: PropTypes.bool,
  withTotals: PropTypes.bool,
}

export default withTranslation()(OrderItems)
