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
    flex: 1,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#dddddd',
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

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

const CartLine = (props) => {

  return (
    <View style={ styles.item }>
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

  renderItemAdjustments(adjustments) {

    return (
      <View>
        { adjustments.map(adjustment => (
          <Text style={ styles.adjustmentText } key={ `ADJUSTMENT#${adjustment.id}` }>
            { adjustment.label }
          </Text>
        )) }
      </View>
    )
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
            { (item.adjustments && item.adjustments.hasOwnProperty('menu_item_modifier')) &&
              this.renderItemAdjustments(item.adjustments.menu_item_modifier) }
          </Col>
          <Col size={ 3 } style={ [ styles.col, styles.colRight ] }>
            <Text>{ `${formatPrice(item.total)}` }</Text>
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
        value={ `${formatPrice(this._deliveryTotal(this.props.order))}` } />
    )
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

    return (
      <View style={ styles.container }>
        <View style={{ flex: 8 }}>
          <FlatList
            data={ order.items }
            keyExtractor={ (item, index) => `ITEM#${item.id}` }
            renderItem={ ({ item }) => this.renderItem(item) }
            ItemSeparatorComponent={ ItemSeparatorComponent } />
        </View>
        <View style={{ flex: 2 }}>
          { this.renderItemsTotal() }
          { this.props.withDeliveryTotal === true && this.renderAdjustments() }
          { this.props.withDeliveryTotal === true && this.renderTotal() }
        </View>
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
