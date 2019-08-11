import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import {
  Container,
  Header,
  Left, Right, Body,
  Title, Content, Footer, Button, Icon, List, ListItem, Text
} from 'native-base'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { formatPrice } from '../../Cart'
import { init } from '../../redux/Account/actions'


class AccountOrdersPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    this.props.init()
  }
  _renderItem(order) {

    const { navigate } = this.props.navigation

    return (
      <ListItem onPress={() => navigate('AccountOrder', { order }) }>
        <Body><Text>{ order.restaurant.name }</Text></Body>
        <Right><Text>{ formatPrice(order.total) } €</Text></Right>
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
        data: orders
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

const styles = StyleSheet.create({
});

function mapStateToProps(state) {

  return {
    orders: state.account.orders
  }
}

function mapDispatchToProps(dispatch) {

  return {
    init: () => dispatch(init()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountOrdersPage))
