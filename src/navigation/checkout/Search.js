import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
} from 'react-native';
import {
  Container,
  Body,
  Icon, Text,
  Card, CardItem,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import RestaurantSearch from '../../components/RestaurantSearch'
import RestaurantList from '../../components/RestaurantList'
import { searchRestaurants, searchRestaurantsForAddress, setAddress } from '../../redux/Checkout/actions'

class RestaurantsPage extends Component {

  _onAddressChange(address) {
    if (address) {
      this.props.searchRestaurantsForAddress(address)
    }
  }

  componentDidMount() {
    this.props.searchRestaurants()
  }

  componentDidUpdate(prevProps) {

    const prevAddress = prevProps.navigation.getParam('address', null)
    const addressAsParam = this.props.navigation.getParam('address', null)

    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() => this._onAddressChange(addressAsParam))
    }
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

  renderContent() {
    const { restaurants } = this.props

    if (restaurants.length === 0) {

      return (
        <View style={ styles.content }>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="search" style={{ color: '#cccccc' }} />
            <Text note>{ this.props.t('ENTER_ADDRESS') }</Text>
          </View>
        </View>
      )
    }

    return (
      <RestaurantList
        restaurants={ restaurants }
        onItemClick={ restaurant => this.props.navigation.navigate('CheckoutRestaurant', { restaurant }) } />
    )
  }

  render() {

    let searchText = ''
    const addressAsParam = this.props.navigation.getParam('address', null)
    if (addressAsParam) {
      searchText = addressAsParam.streetAddress
    }

    return (
      <Container style={{ paddingTop: 54 }} testID="checkoutSearch">
        <RestaurantSearch
          ref={ component => { this.restaurantSearch = component } }
          onChange={ address => this._onAddressChange(address) }
          defaultValue={ searchText }
          key={ searchText } />
        { this.renderContent() }
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function mapStateToProps(state) {

  return {
    loading: state.checkout.isFetching,
    restaurants: state.checkout.restaurants,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurants: (latitude, longitude) => dispatch(searchRestaurants(latitude, longitude)),
    searchRestaurantsForAddress: address => dispatch(searchRestaurantsForAddress(address)),
    setAddress: address => dispatch(setAddress(address)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RestaurantsPage))
