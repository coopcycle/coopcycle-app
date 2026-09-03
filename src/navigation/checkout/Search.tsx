import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, InteractionManager, View } from 'react-native';
import { connect } from 'react-redux';

import RestaurantList from '../../components/RestaurantList';
import RestaurantSearch from '../../components/RestaurantSearch';
import {
  resetSearch,
  searchRestaurants,
  searchRestaurantsForAddress,
  setRestaurant,
} from '../../redux/Checkout/actions';
import { selectRestaurants } from '../../redux/Checkout/selectors';

class RestaurantsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      searchText: '',
    };
  }

  _onAddressSelect(address) {
    if (address) {
      this.props.searchRestaurantsForAddress(address);
    }
  }

  componentDidMount() {
    const { address } = this.props;

    if (address) {
      this.props.searchRestaurantsForAddress(address);
    } else {
      this.props.searchRestaurants();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const prevAddress = prevProps.route.params?.address;
    const addressAsParam = this.props.route.params?.address;

    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() =>
        this._onAddressSelect(addressAsParam),
      );
    }
  }

  render() {
    const { restaurants, addressAsText, isFetching } = this.props;

    return (
      <View
        style={{ flex: 1, paddingTop: 70 }}
        testID="checkoutSearch"
        onLayout={event =>
          this.setState({ width: event.nativeEvent.layout.width })
        }>
        <View style={{ flexGrow: 1 }}>
          <RestaurantList
            restaurants={restaurants}
            addressAsText={addressAsText}
            isFetching={isFetching}
            onItemClick={restaurant => {
              this.props.setRestaurant(restaurant['@id']);
              this.props.navigation.navigate('CheckoutRestaurant', {
                restaurant,
              });
            }}
          />
        </View>
        {/* This component needs to be rendered *ABOVE* the list */}
        {/* This is why it should be the last child component */}
        {/* Use a "key" prop to make sure component renders */}
        <RestaurantSearch
          country={this.props.country}
          onSelect={address => this._onAddressSelect(address)}
          onReset={() => {
            this.props.resetSearch();
          }}
          defaultValue={this.props.address}
          width={this.state.width}
          key={this.props.addressAsText}
          savedAddresses={this.props.savedAddresses}
        />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    restaurants: selectRestaurants(state),
    address: state.checkout.address,
    addressAsText: state.checkout.address
      ? state.checkout.address.streetAddress
      : '',
    savedAddresses: state.account.addresses.slice(0, 3),
    baseURL: state.app.baseURL,
    isFetching: state.checkout.isFetching || state.app.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchRestaurants: options => dispatch(searchRestaurants(options)),
    searchRestaurantsForAddress: (address, options) =>
      dispatch(searchRestaurantsForAddress(address, options)),
    setRestaurant: id => dispatch(setRestaurant(id)),
    resetSearch: options => dispatch(resetSearch(options)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(RestaurantsPage));
