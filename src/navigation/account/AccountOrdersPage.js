import React, { Component } from 'react'
import { InteractionManager, SectionList } from 'react-native'
import {
  Container,
  Right, Body,
  Content, ListItem, Text,
} from 'native-base'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../utils/formatting'
import { loadOrders } from '../../redux/Account/actions'

class AccountOrdersPage extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadOrders()
    })
  }

  _renderItem(order) {

    const { navigate } = this.props.navigation

    return (
      <ListItem onPress={() => navigate('AccountOrder', { order }) }>
        <Body><Text>{ order.restaurant.name }</Text></Body>
        <Right><Text>{ formatPrice(order.total) }</Text></Right>
      </ListItem>
    );
  }

  _renderSectionHeader(section) {
    return (
      <ListItem itemHeader>
        <Text>{ moment(section.day).format('LL') }</Text>
      </ListItem>
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
      <Container>
        <Content>
          <SectionList
            sections={ sections }
            renderItem={ ({ item }) => this._renderItem(item) }
            renderSectionHeader={ ({ section }) => this._renderSectionHeader(section) }
            keyExtractor={ (item, index) => index }
          />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
    orders: state.account.orders,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadOrders: () => dispatch(loadOrders()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountOrdersPage))
