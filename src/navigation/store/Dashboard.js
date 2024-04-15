import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import DeliveryList from '../../components/DeliveryList';

import variables from '../../../native-base-theme/variables/platform';

import {
  init,
  loadAddresses,
  loadDeliveries,
  loadMoreDeliveries,
} from '../../redux/Store/actions';

class StoreDashboard extends Component {
  componentDidMount() {
    // This is needed to display the title
    this.props.navigation.setParams({ store: this.props.store });
    this.props.init(this.props.store);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginBottom: variables.isIphoneX ? 88 : 0,
        }}>
        <DeliveryList
          data={this.props.deliveries}
          loading={this.props.loadingMore}
          onEndReached={this.props.loadMoreDeliveries}
          onItemPress={item => navigate('StoreDelivery', { delivery: item })}
          onRefresh={() => this.props.loadDeliveries(this.props.store, true)}
          refreshing={this.props.refreshing}
          itemCaptionLines={delivery => {
            const { pickup, dropoff } = delivery;

            const lines = [];
            if (
              pickup.address['@id'] === this.props.store.address['@id'] &&
              !_.isEmpty(dropoff.address.contactName)
            ) {
              lines.push(dropoff.address.contactName);
            } else {
              lines.push(pickup.address.streetAddress);
            }
            lines.push(dropoff.address.streetAddress);

            return lines;
          }}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: state.store.store,
    deliveries: state.store.deliveries,
    loadingMore: state.store.loadingMore,
    refreshing: state.store.refreshing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadDeliveries: (store, refresh = false) =>
      dispatch(loadDeliveries(store, refresh)),
    loadAddresses: store => dispatch(loadAddresses(store)),
    init: store => dispatch(init(store)),
    loadMoreDeliveries: () => dispatch(loadMoreDeliveries()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(StoreDashboard));
