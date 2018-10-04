import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Button
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import KeepAwake from 'react-native-keep-awake'
import moment from 'moment'

import OrderList from '../../components/OrderList'
import LoaderOverlay from '../../components/LoaderOverlay'
import RushModeAlert from './components/RushModeAlert'
import { loadOrders } from '../../redux/Restaurant/actions'

class DashboardPage extends Component {

  componentDidMount() {

    KeepAwake.activate()

    // This is needed to display the title
    this.props.navigation.setParams({ restaurant: this.props.restaurant })

    this.props.loadOrders(
      this.props.httpClient,
      this.props.restaurant,
      this.props.date.format('YYYY-MM-DD')
    )
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
          <View style={ styles.datePicker }>
            <Grid>
              <Row>
                <Col>
                  <Text>{ date.format('ll') }</Text>
                </Col>
                <Col>
                  <Button small light style={{ alignSelf: 'flex-end' }}
                    onPress={ () => navigate('RestaurantDate') }>
                    <Text>Change</Text>
                  </Button>
                </Col>
              </Row>
            </Grid>
          </View>
          <OrderList orders={ orders }
            onItemClick={ order => navigate('RestaurantOrder', { order }) } />
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  datePicker: {
    padding: 20
  },
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
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(DashboardPage))
