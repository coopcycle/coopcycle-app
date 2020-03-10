import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import KeepAwake from 'react-native-keep-awake'
import moment from 'moment'

import Offline from '../../components/Offline'
import OrderList from './components/OrderList'
import DatePickerHeader from './components/DatePickerHeader'
import { changeStatus, loadOrdersByDate, changeDate } from '../../redux/Restaurant/actions'

class AdminDashboard extends Component {

  componentDidMount() {

    KeepAwake.activate()

    if (this.props.navigation.getParam('loadOrders', true)) {
      this.props.loadOrdersByDate(
        this.props.date.format('YYYY-MM-DD')
      )
    }
  }

  componentWillUnmount() {
    KeepAwake.deactivate()
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.props.loadOrdersByDate(
        this.props.date.format('YYYY-MM-DD')
      )
    }
  }

  renderDashboard() {

    const { navigate } = this.props.navigation
    const { orders, date, restaurant, specialOpeningHoursSpecification } = this.props

    return (
      <Container>
        <Content>
          <DatePickerHeader
            date={ date }
            onCalendarClick={ () => navigate('RestaurantDate') }
            onTodayClick={ () => this.props.changeDate(moment()) } />
          <OrderList orders={ orders }
            onItemClick={ order => navigate('RestaurantOrder', { order }) } />
        </Content>
      </Container>
    )
  }

  render() {

    if (this.props.isInternetReachable) {
      return this.renderDashboard()
    }

    return (
      <Container>
        <Content contentContainerStyle={ styles.content }>
          <Offline />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    alignItems: 'center',
    padding: 20,
  },
});

function mapStateToProps(state) {

  return {
    orders: state.restaurant.orders,
    date: state.restaurant.date,
    isInternetReachable: state.app.isInternetReachable,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrdersByDate: (date) => dispatch(loadOrdersByDate(date)),
    changeDate: date => dispatch(changeDate(date)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AdminDashboard))
