import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import PropTypes from 'prop-types'
import { Text } from 'native-base'
import { Col, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../utils/formatting'
import _ from 'lodash'

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  adjustmentText: {
    fontSize: 14,
    color: '#999',
  },
  col: {
    justifyContent: 'center',
  },
  colRight: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontWeight: '600',
    fontSize: 15 * 1.2,
  },
  itemQuantityHighlight: {
    color: '#FF851B',
  },
});

const CartLine = (props) => {

  const containerStyle = [ styles.item ]
  if (props.last === true) {
    containerStyle.push(styles.itemLast)
  }

  return (
    <View style={ containerStyle }>
      <View style={ styles.col }>
        <Text style={{ fontWeight: 'bold' }}>{ props.label }</Text>
      </View>
      <View style={ [ styles.col, styles.colRight ] }>
        <Text style={{ fontWeight: 'bold' }}>{ props.value }</Text>
      </View>
    </View>
  )
}

class OrderItems extends Component {

  renderItemAdjustments(item) {
    if (item.adjustments.hasOwnProperty('menu_item_modifier')) {
      return (
        <View>
          { item.adjustments.menu_item_modifier.map(adjustment => (
            <Text style={ styles.adjustmentText } key={ `ADJUSTMENT#${adjustment.id}` }>
              { adjustment.label }
            </Text>
          )) }
        </View>
      )
    }
  }

  renderItem(item) {

    const itemQuantityStyle = [ styles.itemQuantity ]
    if (item.quantity > 1) {
      itemQuantityStyle.push(styles.itemQuantityHighlight)
    }

    return (
      <TouchableOpacity style={ styles.item }>
        <Grid>
          <Col size={ 2 } style={ [ styles.col ] }>
            <Text style={ itemQuantityStyle }>{ `${item.quantity} ×` }</Text>
          </Col>
          <Col size={ 7 } style={ styles.col }>
            <Text>{ item.name }</Text>
            { this.renderItemAdjustments(item) }
          </Col>
          <Col size={ 3 } style={ [ styles.col, styles.colRight ] }>
            <Text>{ `${formatPrice(item.total)} €` }</Text>
          </Col>
        </Grid>
      </TouchableOpacity>
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

    return (
      <CartLine
        label={ this.props.t('TOTAL_DELIVERY') }
        value={ `${formatPrice(this._deliveryTotal(this.props.order))} €` } />
    )
  }

  renderItemsTotal() {

    return (
      <CartLine
        label={ this.props.t('TOTAL_ITEMS') }
        value={ `${formatPrice(this.props.order.itemsTotal)} €` } />
    )
  }

  renderTotal() {

    return (
      <CartLine
        label={ this.props.t('TOTAL') }
        value={ `${formatPrice(this.props.order.total)} €` }
        last={ true } />
    )
  }

  render() {

    const { order } = this.props

    return (
      <View style={ styles.container }>
        <FlatList
          data={ order.items }
          keyExtractor={ (item, index) => `ITEM#${item.id}` }
          renderItem={ ({ item }) => this.renderItem(item) } />
        { this.renderItemsTotal() }
        { this.props.withDeliveryTotal === true && this.renderAdjustments() }
        { this.props.withDeliveryTotal === true && this.renderTotal() }
      </View>
    )
  }
}

OrderItems.defaultProps = {
  withDeliveryTotal: false,
}

OrderItems.propTypes = {
  withDeliveryTotal: PropTypes.bool,
}

export default withTranslation()(OrderItems)
