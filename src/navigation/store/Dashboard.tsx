import _ from 'lodash';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeliveryList from '../../components/DeliveryList';

import {
  init,
  loadDeliveries,
  loadMoreDeliveries,
} from '../../redux/Store/actions';
import { setStore } from '../../redux/Delivery/actions';
import { RootState } from '@/src/redux/store';
import { Store } from '@/src/redux/api/types';

class StoreDashboard extends Component {
  componentDidMount() {
    this.props.init(this.props.store);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
        edges={['bottom']}>
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
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: RootState) {
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
    init: (store: Store) => {
      dispatch(init(store));
      dispatch(setStore(store));
    },
    loadMoreDeliveries: () => dispatch(loadMoreDeliveries()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(StoreDashboard));
