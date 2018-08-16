import React, { Component } from 'react'
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text, Thumbnail, Badge } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import slugify from 'slugify'
import moment from 'moment/min/moment-with-locales'
import _ from 'lodash'
import { translate } from 'react-i18next'
import { localeDetector } from '../i18n'
import { formatPrice } from '../Cart'

moment.locale(localeDetector())

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    backgroundColor: '#fff'
  },
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
          <Col size={ 4 } style={ styles.col }>
            <Text>{ `${formatPrice(order.total)} €` }</Text>
          </Col>
          <Col size={ 4 } style={ styles.col }>
            <Text>{ moment(order.shippedAt).format('LT') }</Text>
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

    const newOrders = ordersByState.hasOwnProperty('new') ? ordersByState['new'] : []
    const acceptedOrders = ordersByState.hasOwnProperty('accepted') ? ordersByState['accepted'] : []

    return (
      <SectionList
        data={ this.props.orders }
        keyExtractor={ (item, index) => item['@id'] }
        sections={[
          { title: 'New orders', data: newOrders },
          { title: 'Accepted orders', data: acceptedOrders },
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
