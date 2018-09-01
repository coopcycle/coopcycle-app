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
import moment from 'moment'
import OrderList from '../../components/OrderList'
import LoaderOverlay from '../../components/LoaderOverlay'
import RushModeAlert from './components/RushModeAlert'
import { changeRestaurant, loadOrders } from '../../redux/Restaurant/actions'

class DashboardPage extends Component {

  componentDidMount() {
    const { restaurant } = this.props.navigation.state.params

    this.props.changeRestaurant(restaurant)
    this.props.loadOrders(this.props.httpClient, restaurant, this.props.date.format('YYYY-MM-DD'))
  }

  componentDidUpdate(prevProps) {
    const { restaurant } = this.props

    if (prevProps.date !== this.props.date) {
      this.props.loadOrders(this.props.httpClient, restaurant, this.props.date.format('YYYY-MM-DD'))
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

//

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
    changeRestaurant: restaurant => dispatch(changeRestaurant(restaurant)),
    loadOrders: (client, restaurant, date) => dispatch(loadOrders(client, restaurant, date)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(DashboardPage))
