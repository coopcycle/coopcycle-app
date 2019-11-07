import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Button,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import KeepAwake from 'react-native-keep-awake'
import moment from 'moment'

import DangerAlert from './components/DangerAlert'
import OrderList from './components/OrderList'
import DatePickerHeader from './components/DatePickerHeader'
import { changeStatus, loadOrders, changeDate, deleteOpeningHoursSpecification } from '../../redux/Restaurant/actions'
import { selectSpecialOpeningHoursSpecification } from '../../redux/Restaurant/selectors'

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

    const hasRestaurantChanged = this.props.restaurant !== prevProps.restaurant
      && this.props.restaurant['@id'] !== prevProps.restaurant['@id']

    const hasChanged = this.props.date !== prevProps.date || hasRestaurantChanged

    if (hasChanged) {
      this.props.loadOrders(
        this.props.httpClient,
        this.props.restaurant,
        this.props.date.format('YYYY-MM-DD')
      )
    }
    if (hasRestaurantChanged) {
      // This is needed to display the title
      this.props.navigation.setParams({ restaurant: this.props.restaurant })
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const { orders, date, restaurant, specialOpeningHoursSpecification } = this.props

    return (
      <Container>
        { restaurant.state === 'rush' && (
          <DangerAlert
            text={ this.props.t('RESTAURANT_ALERT_RUSH_MODE_ON') }
            onClose={ () => this.props.changeStatus(this.props.restaurant, 'normal') } />
        )}
        { specialOpeningHoursSpecification && (
          <DangerAlert
            text={ this.props.t('RESTAURANT_ALERT_CLOSED') }
            onClose={ () => this.props.deleteOpeningHoursSpecification(specialOpeningHoursSpecification) } />
        )}
        <Content style={ styles.content }>
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
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  },
  message: {
    alignItems: 'center',
    padding: 20,
  },
});

function mapStateToProps(state) {

  return {
    httpClient: state.app.httpClient,
    orders: state.restaurant.orders,
    date: state.restaurant.date,
    restaurant: state.restaurant.restaurant,
    specialOpeningHoursSpecification: selectSpecialOpeningHoursSpecification(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrders: (client, restaurant, date) => dispatch(loadOrders(client, restaurant, date)),
    changeDate: date => dispatch(changeDate(date)),
    changeStatus: (restaurant, state) => dispatch(changeStatus(restaurant, state)),
    deleteOpeningHoursSpecification: openingHoursSpecification =>
      dispatch(deleteOpeningHoursSpecification(openingHoursSpecification)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(DashboardPage))
