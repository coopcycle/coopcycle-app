import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Container, Icon, Text } from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import RestaurantSearch from '../../components/RestaurantSearch'
import RestaurantList from '../../components/RestaurantList'
import { searchRestaurants, searchRestaurantsForAddress, resetSearch } from '../../redux/Checkout/actions'

class RestaurantsPage extends Component {

  constructor() {
    super()
    this.state = {
      width: Dimensions.get('window').width,
      searchText: '',
    }
  }

  _onAddressSelect(address) {
    if (address) {
      this.props.searchRestaurantsForAddress(address)
    }
  }

  componentDidMount() {
    this.props.searchRestaurants()
  }

  componentDidUpdate(prevProps, prevState) {
    const prevAddress = prevProps.navigation.getParam('address', null)
    const addressAsParam = this.props.navigation.getParam('address', null)
    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() => this._onAddressSelect(addressAsParam))
    }
  }

  renderContent() {
    const { restaurants, addressAsText } = this.props

    if (restaurants.length === 0) {

      if (addressAsText) {

        return (
          <View style={ styles.content }>
            <View style={{ paddingHorizontal: 15 }}>
              <Text note style={{ textAlign: 'center' }}>
                {this.props.t('NO_RESTAURANTS')}
              </Text>
            </View>
          </View>
        )
      }

      return (
        <View style={ styles.content } testID="checkoutSearchContent">
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="search" style={{ color: '#cccccc' }} />
            <Text note>{ this.props.t('ENTER_ADDRESS') }</Text>
          </View>
        </View>
      )
    }

    return (
      <SafeAreaView>
        <RestaurantList
          restaurants={ restaurants }
          onItemClick={ restaurant => this.props.navigation.navigate('CheckoutRestaurant', { restaurant }) } />
      </SafeAreaView>
    )
  }

  render() {

    return (
      <Container style={{ paddingTop: 54 }} testID="checkoutSearch"
        onLayout={ event => this.setState({ width: event.nativeEvent.layout.width }) }
        >
        { this.renderContent() }
        { /* This component needs to be rendered *ABOVE* the list */ }
        { /* This is why it should be the last child component */ }
        { /* Use a "key" prop to make sure component renders */ }
        <RestaurantSearch
          googleApiKey={ this.props.googleApiKey }
          country={ this.props.country }
          onSelect={ address => this._onAddressSelect(address) }
          onReset={ () => {
            this.props.resetSearch()
          } }
          defaultValue={ this.props.address }
          width={ this.state.width }
          key={ this.props.addressAsText }
          savedAddresses={ this.props.savedAddresses } />
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

function mapStateToProps(state, ownProps) {

  return {
    googleApiKey: state.app.settings.google_api_key,
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    restaurants: state.checkout.restaurants,
    address: state.checkout.address,
    addressAsText: state.checkout.address ? state.checkout.address.streetAddress : '',
    savedAddresses: state.account.addresses.slice(0, 3),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurants: (latitude, longitude) => dispatch(searchRestaurants(latitude, longitude)),
    searchRestaurantsForAddress: address => dispatch(searchRestaurantsForAddress(address)),
    resetSearch: () => dispatch(resetSearch()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RestaurantsPage))
