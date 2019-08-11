import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  Container, Content,
  Left, Right, Body,
  Text, Icon, Thumbnail,
  Card, CardItem
} from 'native-base';
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import RestaurantSearch from '../../components/RestaurantSearch'
import RestaurantList from '../../components/RestaurantList'
import { searchRestaurants, setAddress } from '../../redux/Checkout/actions'

class RestaurantsPage extends Component {

  _onAddressChange(address) {
    if (address) {
      const { latitude, longitude } = address.geo
      this.props.searchRestaurants({ latitude, longitude })
      this.props.setAddress(address)
    }
  }

  componentDidMount() {
    this.props.searchRestaurants()
  }

  renderWarning() {

    const { restaurants } = this.state
    const { loading } = this.props

    if (!loading && restaurants.length === 0) {
      return (
        <View style={{ paddingHorizontal: 10, marginTop: 30 }}>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  {this.props.t('NO_RESTAURANTS')}
                </Text>
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
    const { restaurants } = this.props

    let contentProps = {}
    if (restaurants.length === 0) {
      contentProps = {
        contentContainerStyle: styles.content
      }
    }

    return (
      <Container style={{ paddingTop: 54 }} testID="checkoutSearch">
        <RestaurantSearch
          ref={ component => this.restaurantSearch = component }
          onChange={ this._onAddressChange.bind(this) } />
        <Content { ...contentProps }>
          <RestaurantList
            restaurants={ restaurants }
            onItemClick={ restaurant => navigate('CheckoutRestaurant', { restaurant }) } />
          { /* this.renderWarning() */ }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

function mapStateToProps(state) {

  return {
    loading: state.checkout.isFetching,
    restaurants: state.checkout.restaurants
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurants: (latitude, longitude) => dispatch(searchRestaurants(latitude, longitude)),
    setAddress: address => dispatch(setAddress(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RestaurantsPage))
