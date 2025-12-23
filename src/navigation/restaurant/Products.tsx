import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    this.props.loadProducts(this.props.restaurant);
  }

  _toggleProductEnabled(product, value) {
    this.props.changeProductEnabled(product, value);
  }

  renderItem(item) {
    return (
      <HStack className="p-3 justify-between">
        <Text>{item.name}</Text>
        <Switch
          value={item.enabled}
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
      <SafeAreaView>
        <FlatList
          data={products}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this.renderItem(item)}
          initialNumToRender={15}
          ItemSeparatorComponent={ItemSeparator}
          ListFooterComponent={() => {
            if (products.length > 0 && hasMoreProducts) {
              return (
                <Button
                  variant="link"
                  className="m-4"
                  onPress={() => this.props.loadMoreProducts()}>
                  <ButtonText>
                    {this.props.t('LOAD_MORE')}
                  </ButtonText>
                </Button>
              );
            }

            return null;
          }}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
    products: state.restaurant.products.sort((a, b) =>
      a.name < b.name ? -1 : 1,
    ),
    hasMoreProducts: state.restaurant.hasMoreProducts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProducts: (restaurant) => dispatch(loadProducts(restaurant)),
    loadMoreProducts: () => dispatch(loadMoreProducts()),
    changeProductEnabled: (product, enabled) => dispatch(changeProductEnabled(product, enabled)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ProductsScreen));
