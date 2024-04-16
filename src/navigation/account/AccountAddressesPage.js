import { Divider, HStack, Heading, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import ItemSeparator from '../../components/ItemSeparator';
import i18n from '../../i18n';
import { loadAddresses, newAddress } from '../../redux/Account/actions';
import {
  searchRestaurantsForAddress,
  setAddress,
} from '../../redux/Checkout/actions';
import { selectAddresses } from '../../redux/Checkout/selectors';
import { greyColor } from '../../styles/common';
import { useSecondaryTextColor } from '../../styles/theme';
import Address from '../../utils/Address';

class AccountAddressesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      focused: false,
    };
  }

  _renderRow({ item }) {
    const color = this.props.address
      ? Address.geoDiff(this.props.address, item)
        ? greyColor
        : 'transparent'
      : 'transparent';

    return (
      <TouchableOpacity
        onPress={() => {
          this.props.setAddress(item);
          //TODO: Need to be more robust that a simple goBack()
          this.props.navigation.goBack();
        }}>
        <HStack
          px="2"
          py="3"
          space={2}
          style={{ backgroundColor: color }}
          justifyContent="space-between">
          <Text>{item.streetAddress}</Text>
          <Text>{item.name}</Text>
        </HStack>
      </TouchableOpacity>
    );
  }

  render() {
    const { addresses } = this.props;
    const textInputContainerHeight = 54;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <AddressAutocomplete
            inputContainerStyle={{
              justifyContent: 'center',
              borderWidth: 0,
              height: textInputContainerHeight,
              borderRadius: 5,
            }}
            style={{
              height: textInputContainerHeight * 0.7,
              borderRadius: 3,
            }}
            placeholder={i18n.t('ENTER_NEW_ADDRESS')}
            onChangeText={text => this.setState({ focused: text.length >= 3 })}
            onSelectAddress={address => {
              this.props.navigation.navigate('AddressDetails', { address });
            }}
            onBlur={() => this.setState({ focused: false })}
          />
        </View>
        {!this.state.focused && (
          <View style={{ flex: 4 }}>
            <Divider />
            <Heading margin={3}>{i18n.t('MY_ADDRESSES')}</Heading>
            <FlatList
              keyExtractor={(item, index) => `address-${index}`}
              data={addresses}
              refreshing={this.state.refreshing}
              onRefresh={async () => {
                this.setState({ refreshing: true });
                await this.props.loadAddresses();
                this.setState({ refreshing: false });
              }}
              ItemSeparatorComponent={ItemSeparator}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Image
                    style={{
                      maxWidth: '40%',
                      maxHeight: '30%',
                      marginVertical: '5%',
                      margin: 'auto',
                    }}
                    source={require('../../assets/images/no_addresses.png')}
                    resizeMode={'contain'}
                  />
                  <Heading>Hey oh !</Heading>
                  <Text color={this.props.secondaryTextColor}>
                    {i18n.t('EMPTY_HERE')}
                  </Text>
                </View>
              }
              renderItem={this._renderRow.bind(this)}
            />
          </View>
        )}
      </View>
    );
  }
}

AccountAddressesPage.propTypes = {
  onSelect: PropTypes.func,
};

function mapStateToProps(state, ownProps) {
  const fnSelect = () => {
    switch (ownProps.route.params?.action) {
      case 'cart':
        return ownProps.route.params?.cart.shippingAddress || {};
      default:
        return state.checkout.address;
    }
  };

  return {
    addresses: selectAddresses(state),
    address: fnSelect(),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const fnSelect = address => {
    const addressPrecise = { ...address, isPrecise: true };
    switch (ownProps.route.params?.action) {
      case 'search':
        return dispatch(searchRestaurantsForAddress(addressPrecise));
      case 'cart':
        return dispatch(setAddress(addressPrecise, ownProps.route.params.cart));
      default:
        dispatch(setAddress(addressPrecise));
    }
  };
  return {
    loadAddresses: () => dispatch(loadAddresses()),
    newAddress: address => dispatch(newAddress(address)),
    setAddress: address => fnSelect(address),
  };
}

function withHooks(ClassComponent) {
  return function CompWithHook(props) {
    const secondaryTextColor = useSecondaryTextColor();
    return (
      <ClassComponent {...props} secondaryTextColor={secondaryTextColor} />
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withHooks(AccountAddressesPage)));
