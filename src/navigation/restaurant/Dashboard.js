import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import OrderList from '../../components/OrderList'
import LoaderOverlay from '../../components/LoaderOverlay'
import { loadOrders } from '../../redux/Restaurant/actions'

class DashboardPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const { restaurant } = this.props.navigation.state.params
    this.props.loadOrders(this.props.httpClient, restaurant)
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurant } = this.props.navigation.state.params
    const { orders } = this.props

    return (
      <Container>
        <Content style={ styles.content }>
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
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadOrders: (client, restaurant) => dispatch(loadOrders(client, restaurant)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(DashboardPage))
