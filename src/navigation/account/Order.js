import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Center, Icon, Text, VStack } from 'native-base';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import OrderItems from '../../components/OrderItems';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../../i18n';
import AddressModal from '../checkout/components/AddressModal';
import {
  generateInvoice,
  hideAddressModal,
  shareInvoice,
  showAddressModal,
} from '../../redux/Checkout/actions';
import { find } from 'lodash';

class OrderPage extends Component {
  renderDetail(order) {
    return (
      <VStack flex={1} testID="accountOrder">
        <Center mb="3" py="2">
          <Icon style={styles.restaurantText} as={FontAwesome} name="cutlery" />
          <Text style={styles.restaurantText}>{order.restaurant.name}</Text>
        </Center>
        <OrderItems order={order} withDeliveryTotal={true} />
      </VStack>
    );
  }

  render() {
    const { order } = this.props;

    if (order) {
      return (
        <>
          <VStack flex={1}>
            {this.renderDetail(order)}
            {order.state === 'fulfilled' && order.hasReceipt && (
              <Button
                onPress={() => this.props.shareInvoice(order)}
                leftIcon={<Icon as={Ionicons} name="share-outline" size="sm" />}
                margin={5}
                variant="subtle"
                colorScheme="secondary">
                {i18n.t('SHARE_INVOICE')}
              </Button>
            )}
            {order.state === 'fulfilled' && !order.hasReceipt && (
              <Button
                onPress={() => {
                  this.props.showAddressModal(i18n.t('BILLING_ADDRESS'));
                }}
                leftIcon={
                  <Icon as={Ionicons} name="receipt-outline" size="sm" />
                }
                margin={5}
                variant="subtle"
                colorScheme="secondary"
                isLoading={this.props.loading}>
                {i18n.t('GENERATE_INVOICE')}
              </Button>
            )}
          </VStack>
          {order.state === 'fulfilled' && !order.hasReceipt && (
            <AddressModal
              value={order?.shippingAddress}
              onSelect={address => {
                this.props.hideAddressModal();
                this.props.generateInvoice(order, address);
              }}
            />
          )}
        </>
      );
    }

    return <View />;
  }
}

const styles = StyleSheet.create({
  restaurantText: {
    color: '#cccccc',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    height: 320,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

function mapStateToProps(state, ownProps) {
  return {
    order: find(
      state.account.orders,
      o => o.number === ownProps.route.params.order,
    ),
    loading: state.app.loading,
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    brandName: state.app.settings.brand_name,
    httpClient: state.app.httpClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showAddressModal: reason => dispatch(showAddressModal(reason)),
    hideAddressModal: () => dispatch(hideAddressModal()),
    generateInvoice: (order, address) =>
      dispatch(generateInvoice(order, address)),
    shareInvoice: order => dispatch(shareInvoice(order)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(OrderPage));
