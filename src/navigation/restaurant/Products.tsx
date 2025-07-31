import { HStack, Switch, Text } from 'native-base';
import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import {
  changeProductEnabled,
  loadMoreProducts,
  loadProducts,
} from '../../redux/Restaurant/actions';

class ProductsScreen extends Component {
  componentDidMount() {
    this.props.loadProducts(this.props.httpClient, this.props.restaurant);
  }

  _toggleProductEnabled(product, value) {
    this.props.changeProductEnabled(this.props.httpClient, product, value);
  }

  renderItem(item) {
    return (
      <HStack p="3" justifyContent="space-between">
        <Text>{item.name}</Text>
        <Switch
          isChecked={item.enabled}
          onToggle={this._toggleProductEnabled.bind(this, item)}
        />
      </HStack>
    );
  }

  _keyExtractor(item, index) {
    return item['@id'];
  }

  render() {
    const { products, hasMoreProducts } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={products}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this.renderItem(item)}
          initialNumToRender={15}
          ItemSeparatorComponent={ItemSeparator}
          ListFooterComponent={() => {
            if (products.length > 0 && hasMoreProducts) {
              return (
                <TouchableOpacity
                  onPress={() => this.props.loadMoreProducts()}
                  style={styles.btn}>
                  <Text style={styles.btnText}>
                    {this.props.t('LOAD_MORE')}
                  </Text>
                </TouchableOpacity>
              );
            }

            return <View />;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  btnText: {
    color: '#0074D9',
  },
});

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    restaurant: state.restaurant.restaurant,
    products: state.restaurant.products.sort((a, b) =>
      a.name < b.name ? -1 : 1,
    ),
    hasMoreProducts: state.restaurant.hasMoreProducts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProducts: (httpClient, restaurant) =>
      dispatch(loadProducts(httpClient, restaurant)),
    loadMoreProducts: () => dispatch(loadMoreProducts()),
    changeProductEnabled: (httpClient, product, enabled) =>
      dispatch(changeProductEnabled(httpClient, product, enabled)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ProductsScreen));
