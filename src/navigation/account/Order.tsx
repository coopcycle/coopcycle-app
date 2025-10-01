import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Utensils, Share, Receipt } from 'lucide-react-native';
import { Center } from '@/components/ui/center';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { find } from 'lodash';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderItems from '../../components/OrderItems';
import i18n from '../../i18n';
import {
  generateInvoice,
  hideAddressModal,
  shareInvoice,
  showAddressModal,
} from '../../redux/Checkout/actions';
import AddressModal from '../checkout/components/AddressModal';
import { selectHttpClient } from '../../redux/App/selectors';

class OrderPage extends Component {
  renderDetail(order) {
    return (
      <VStack flex={1} testID="accountOrder" className="mb-3">
        <Center className="mb-3 py-2">
          <Icon as={Utensils} size={24} />
          <Text >{order.restaurant.name}</Text>
        </Center>
        <OrderItems order={order} withDeliveryTotal={true} />
      </VStack>
    );
  }

  render() {
    const { order } = this.props;

    if (order) {
      return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <VStack flex={1} className="px-2">
            {this.renderDetail(order)}
            {order.state === 'fulfilled' && order.hasReceipt && (
              <Button
                onPress={() => this.props.shareInvoice(order)}>
                <ButtonIcon as={Share} />
                <ButtonText>{i18n.t('SHARE_INVOICE')}</ButtonText>
              </Button>
            )}
            {order.state === 'fulfilled' && !order.hasReceipt && (
              <Button
                onPress={() => {
                  this.props.showAddressModal(i18n.t('BILLING_ADDRESS'));
                }}
                isLoading={this.props.loading}>
                <ButtonIcon as={Receipt} />
                <ButtonText>{i18n.t('GENERATE_INVOICE')}</ButtonText>
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
        </SafeAreaView>
      );
    }

    return <View />;
  }
}

const styles = StyleSheet.create({
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
    httpClient: selectHttpClient(state),
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
