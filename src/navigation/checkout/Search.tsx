import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import ShopCollections from '../../components/ShopCollections';
import {
  searchRestaurants,
  searchRestaurantsForAddress,
  setRestaurant,
} from '../../redux/Checkout/actions';
import ShopsScreenLayout from './components/ShopsScreenLayout';

/**
 * The home screen: the collections of the custom homepage.
 *
 * It is the tab navigator's initial route, so this is also where the shops are
 * loaded for the whole checkout flow — the restaurants list screen reads them
 * from the store.
 */
class RestaurantsPage extends Component {
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

  componentDidUpdate(prevProps) {
    const prevAddress = prevProps.route.params?.address;
    const addressAsParam = this.props.route.params?.address;

    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() =>
        this._onAddressSelect(addressAsParam),
      );
    }
  }

  render() {
    return (
      <ShopsScreenLayout testID="checkoutHome">
        <ScrollView>
          <ShopCollections
            onItemClick={restaurant => {
              this.props.setRestaurant(restaurant['@id']);
              this.props.navigation.navigate('CheckoutRestaurant', {
                restaurant,
              });
            }}
          />
        </ScrollView>
      </ShopsScreenLayout>
    );
  }
}

function mapStateToProps(state) {
  return {
    address: state.checkout.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchRestaurants: options => dispatch(searchRestaurants(options)),
    searchRestaurantsForAddress: (address, options) =>
      dispatch(searchRestaurantsForAddress(address, options)),
    setRestaurant: id => dispatch(setRestaurant(id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(RestaurantsPage));
