import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { localeDetector } from '../../../i18n'
import { formatPrice } from '../../../Cart'

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemLast: {
    borderBottomWidth: 0
  },
  adjustmentText: {
    fontSize: 14,
    color: '#999'
  },
  col: {
    justifyContent: 'center',
  },
  colRight: {
    alignItems: 'flex-end',
  },
});

class OrderItems extends Component {

  renderAdjustments(item) {
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
    return (
      <TouchableOpacity style={ styles.item }>
        <Grid>
          <Col size={ 8 } style={ styles.col }>
            <Text>{ item.name }</Text>
            { this.renderAdjustments(item) }
          </Col>
          <Col size={ 2 } style={ [ styles.col, styles.colRight ] }>
            <Text>{ `× ${item.quantity}` }</Text>
          </Col>
          <Col size={ 2 } style={ [ styles.col, styles.colRight ] }>
            <Text>{ `${formatPrice(item.total)} €` }</Text>
          </Col>
        </Grid>
      </TouchableOpacity>
    )
  }

  render() {

    const { order } = this.props

    return (
      <View style={ styles.container }>
        <FlatList
          data={ order.items }
          keyExtractor={ (item, index) => `ITEM#${item['id']}` }
          renderItem={ ({ item }) => this.renderItem(item) } />
        <Grid>
          <Row style={ [ styles.item, styles.itemLast ] }>
            <Col size={ 10 } style={ styles.col }>
              <Text style={{ fontWeight: 'bold' }}>{ this.props.t('TOTAL') }</Text>
            </Col>
            <Col size={ 2 } style={ [ styles.col, styles.colRight ] }>
              <Text style={{ fontWeight: 'bold' }}>{ `${formatPrice(order.itemsTotal)} €` }</Text>
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}

export default translate()(OrderItems)
