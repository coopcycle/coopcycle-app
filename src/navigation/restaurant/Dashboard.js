import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Button
} from 'native-base';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import KeepAwake from 'react-native-keep-awake'
import moment from 'moment'

import LoaderOverlay from '../../components/LoaderOverlay'
import RushModeAlert from './components/RushModeAlert'
import OrderList from './components/OrderList'
import DatePickerHeader from './components/DatePickerHeader'
import { loadOrders, changeDate } from '../../redux/Restaurant/actions'

class DashboardPage extends Component {

  componentDidMount() {

    KeepAwake.activate()

    // This is needed to display the title
    this.props.navigation.setParams({ restaurant: this.props.restaurant })

    const loadOrders = this.props.navigation.getParam('loadOrders', true)

    if (loadOrders) {
      this.props.loadOrders(
        this.props.httpClient,
        this.props.restaurant,
        this.props.date.format('YYYY-MM-DD')
      )
    }
  }

  componentWillUnmount() {
    KeepAwake.deactivate()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.date !== this.props.date) {
      this.props.loadOrders(
        this.props.httpClient,
        this.props.restaurant,
        this.props.date.format('YYYY-MM-DD')
      )
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const { orders, date, restaurant } = this.props

    return (
      <Container>
        <RushModeAlert restaurant={ restaurant } />
        <Content style={ styles.content }>
          <DatePickerHeader
            date={ date }
            onCalendarClick={ () => navigate('RestaurantDate') }
            onTodayClick={ () => this.props.changeDate(moment()) } />
          <OrderList orders={ orders }
            onItemClick={ order => navigate('RestaurantOrder', { order }) } />
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  },
  message: {
    alignItems: "center",
    padding: 20
  }
});

function mapStateToProps(state) {
  return {
    user: state.app.user,
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
    orders: state.restaurant.orders,
    date: state.restaurant.date,
    restaurant: state.restaurant.restaurant
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrders: (client, restaurant, date) => dispatch(loadOrders(client, restaurant, date)),
    changeDate: date => dispatch(changeDate(date)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(DashboardPage))
