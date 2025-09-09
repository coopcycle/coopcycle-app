import _ from 'lodash';
import { Switch } from '@/components/ui/switch';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import React, { Component } from 'react';
import { SectionList, View } from 'react-native';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import {
  changeProductOptionValueEnabled,
  loadProductOptions,
} from '../../redux/Restaurant/actions';

const SectionHeader = ({ section }) => <Heading className="p-3">{section.title}</Heading>;

class ProductOptions extends Component {
  componentDidMount() {
    this.props.loadProductOptions(this.props.restaurant);
  }

  _toggleProductEnabled(product, enabled) {
    this.props.changeProductOptionValueEnabled(product, enabled);
  }

  _renderItem(productOptionValue) {
    return (
      <HStack className="p-3 justify-between">
        <Text>{productOptionValue.value}</Text>
        <Switch
          value={productOptionValue.enabled}
          onToggle={value =>
            this._toggleProductEnabled(productOptionValue, value)
          }
        />
      </HStack>
    );
  }

  render() {
    const sections = _.map(this.props.productOptions, productOption => ({
      title: productOption.name,
      data: productOption.values,
    }));

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={sections}
          renderItem={({ item }) => this._renderItem(item)}
          renderSectionHeader={SectionHeader}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
    productOptions: state.restaurant.productOptions.sort((a, b) =>
      a.name < b.name ? -1 : 1,
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProductOptions: restaurant => dispatch(loadProductOptions(restaurant)),
    changeProductOptionValueEnabled: (productOptionValue, enabled) =>
      dispatch(changeProductOptionValueEnabled(productOptionValue, enabled)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ProductOptions));
