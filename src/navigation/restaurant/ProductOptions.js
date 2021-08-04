import React, { Component } from 'react'
import { SectionList, View } from 'react-native'
import {
  Left, Right,
  ListItem, Text, Switch,
} from 'native-base'
import _ from 'lodash'

import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { loadProductOptions, changeProductOptionValueEnabled } from '../../redux/Restaurant/actions'

const SectionHeader = ({ section }) => (
  <ListItem itemHeader>
    <Text>{ section.title }</Text>
  </ListItem>
)

class ProductOptions extends Component {

  componentDidMount() {
    this.props.loadProductOptions(this.props.restaurant)
  }

  _toggleProductEnabled(product, enabled) {
    this.props.changeProductOptionValueEnabled(product, enabled)
  }

  _renderItem(productOptionValue) {

    return (
      <ListItem>
        <Left>
          <Text>{ productOptionValue.value }</Text>
        </Left>
        <Right>
          <Switch
            value={ productOptionValue.enabled }
            onValueChange={ (value) => this._toggleProductEnabled(productOptionValue, value) } />
        </Right>
      </ListItem>
    );
  }

  render() {

    const sections = _.map(this.props.productOptions, (productOption) => ({
      title: productOption.name,
      data: productOption.values,
    }))

    return (
      <View style={{ flex: 1 }}>
        <SectionList
          sections={ sections }
          renderItem={ ({ item }) => this._renderItem(item) }
          renderSectionHeader={ SectionHeader }
          keyExtractor={ (item, index) => index }
        />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
    productOptions: state.restaurant.productOptions.sort((a, b) => a.name < b.name ? -1 : 1),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadProductOptions: (restaurant) => dispatch(loadProductOptions(restaurant)),
    changeProductOptionValueEnabled: (productOptionValue, enabled) => dispatch(changeProductOptionValueEnabled(productOptionValue, enabled)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductOptions))
