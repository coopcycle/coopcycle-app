import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Card, CardItem
} from 'native-base';
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import RestaurantSearch from '../components/RestaurantSearch'
import RestaurantList from '../components/RestaurantList'
import { searchRestaurants } from '../redux/Checkout/actions'

class RestaurantsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      deliveryAddress: null,
      deliveryDay: null
    }
  }

  onChange(deliveryAddress, deliveryDay) {
    if (deliveryAddress) {
      const { latitude, longitude } = deliveryAddress.geo
      this.setState({ deliveryAddress, deliveryDay })
      this.props.searchRestaurants(latitude, longitude, deliveryDay)
    }
  }

  renderWarning() {

    const { deliveryDay, restaurants } = this.state
    const { loading } = this.props

    if (!loading && deliveryDay && restaurants.length === 0) {
      return (
        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  {this.props.t('NO_RESTAURANTS')}
                </Text>
                <Text>
                  {`${this.props.t('SEARCH_WITHOUT_DATE')} ?`}
                </Text>
                <Button block style={{ marginTop: 10 }} onPress={ () => this.restaurantSearch.resetDeliveryDate() }>
                  <Text>{this.props.t('SEARCH_AGAIN')}</Text>
                </Button>
              </Body>
            </CardItem>
          </Card>
        </View>
      )
    }

    return (
      <View />
    )
  }

  render() {

    const { navigate } = this.props.navigation
    const { deliveryAddress, deliveryDay } = this.state
    const { restaurants } = this.props

    let contentProps = restaurants.length === 0 ? {
      flex: 1,
      justifyContent: 'center'
    } : {}

    return (
      <Container style={{ paddingTop: 44 }}>
        <RestaurantSearch
          ref={ component => this.restaurantSearch = component }
          onChange={ this.onChange.bind(this) } />
        <Content { ...contentProps }>
          <RestaurantList
            restaurants={ restaurants }
            deliveryDay={ deliveryDay }
            onItemClick={ (restaurant, deliveryDate) => navigate('Restaurant', { restaurant, deliveryAddress, deliveryDate }) } />
          { this.renderWarning() }
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {

  return {
    loading: state.checkout.isFetching,
    restaurants: state.checkout.restaurants
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurants: (latitude, longitude) => dispatch(searchRestaurants(latitude, longitude)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(RestaurantsPage))
