import React, { Component } from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Switch
} from 'native-base'
import _ from 'lodash'

import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { loadProducts, loadMoreProducts, changeProductEnabled } from '../../redux/Restaurant/actions'

class ProductsScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      product: null
    }
  }

  componentDidMount() {
    this.props.loadProducts(this.props.httpClient, this.props.restaurant)
  }

  componentDidUpdate(prevProps, prevState) {
    if (null !== this.state.product) {
      this.props.changeProductEnabled(this.props.httpClient, this.state.product, this.state.product.enabled)
    }

    if (this.props.products !== prevProps.products) {
      this.setState({ product: null })
    }
  }

  _toggleProductEnabled(product, value) {
    this.setState({
      product: {
        ...product,
        enabled: value
      }
    })
  }

  renderItem(item) {
    return (
      <ListItem>
        <Left>
          <Text>{ item.name }</Text>
        </Left>
        <Right>
          <Switch
            value={ item.enabled }
            onValueChange={ this._toggleProductEnabled.bind(this, item) } />
        </Right>
      </ListItem>
    )
  }

  _keyExtractor(item, index) {

    return item['@id']
  }

  render() {

    let { products, hasMoreProducts } = this.props
    const { product } = this.state

    if (product) {
      const productIndex = _.findIndex(products, item => item['@id'] === product['@id'])
      if (-1 !== productIndex) {
        products = products.slice(0)
        products.splice(productIndex, 1, Object.assign({}, product))
      }
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={ products }
          keyExtractor={ this._keyExtractor }
          renderItem={ ({ item }) => this.renderItem(item) }
          initialNumToRender={ 15 }
          ListFooterComponent={ () => {

            if (products.length > 0 && hasMoreProducts) {
              return (
                <TouchableOpacity
                  onPress={ () => this.props.loadMoreProducts() }
                  style={ styles.btn }>
                  <Text style={ styles.btnText }>{ this.props.t('LOAD_MORE') }</Text>
                </TouchableOpacity>
              )
            }

            return (
              <View />
            )
        }} />
      </View>
    )
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
    color: '#0074D9'
  }
})

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    restaurant: state.restaurant.restaurant,
    products: state.restaurant.products,
    hasMoreProducts: state.restaurant.hasMoreProducts,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadProducts: (httpClient, restaurant) => dispatch(loadProducts(httpClient, restaurant)),
    loadMoreProducts: () => dispatch(loadMoreProducts()),
    changeProductEnabled: (httpClient, product, enabled) => dispatch(changeProductEnabled(httpClient, product, enabled)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductsScreen))
