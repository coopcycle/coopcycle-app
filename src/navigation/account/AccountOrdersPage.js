import React, { Component } from 'react'
import { InteractionManager, SectionList, View } from 'react-native'
import {
  HStack, Heading, Pressable, Text,
} from 'native-base'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../utils/formatting'
import { loadOrders } from '../../redux/Account/actions'
import ItemSeparator from '../../components/ItemSeparator'

class AccountOrdersPage extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadOrders()
    })
  }

  _renderItem(order) {

    const { navigate } = this.props.navigation

    return (
      <Pressable onPress={() => navigate('AccountOrders', { screen: 'AccountOrder', params: { order } }) }>
        <HStack justifyContent="space-between" p="2">
          <Text>{ order.restaurant.name }</Text>
          <Text>{ formatPrice(order.total) }</Text>
        </HStack>
      </Pressable>
    );
  }

  _renderSectionHeader(section) {
    return (
      <Heading size="sm" p="2">
        { moment(section.day).format('LL') }
      </Heading>
    )
  }

  render() {

    const ordersByDay =
      _.groupBy(this.props.orders, order => moment(order.shippedAt).format('YYYY-MM-DD'))

    let sections = []
    _.forEach(ordersByDay, (orders, day) => {
      sections.push({
        day: day,
        data: orders,
      })
    })

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={ sections }
          renderItem={ ({ item }) => this._renderItem(item) }
          renderSectionHeader={ ({ section }) => this._renderSectionHeader(section) }
          keyExtractor={ (item, index) => index }
          ItemSeparatorComponent={ ItemSeparator }
        />
      </View>
    );
  }
}

function mapStateToProps(state) {

  // At the moment, we only show foodtech orders
  const orders = _.filter(state.account.orders, o => !!o.restaurant)

  return {
    orders,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadOrders: () => dispatch(loadOrders()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountOrdersPage))
