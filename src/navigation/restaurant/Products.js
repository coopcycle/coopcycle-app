import React, { Component } from 'react'
import { Dimensions, FlatList, StyleSheet, View } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Switch
} from 'native-base'
import _ from 'lodash'

import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import LoaderOverlay from '../../components/LoaderOverlay'
import { loadProducts, changeProductEnabled } from '../../redux/Restaurant/actions'

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

  render() {

    let { products } = this.props
    const { product } = this.state

    if (product) {
      const productIndex = _.findIndex(products, item => item['@id'] === product['@id'])
      if (-1 !== productIndex) {
        products = products.slice(0)
        products.splice(productIndex, 1, Object.assign({}, product))
      }
    }

    return (
      <Container>
        <Content>
          <List
            dataArray={ products }
            renderRow={ (item) => this.renderItem(item) } />
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
    restaurant: state.restaurant.restaurant,
    products: state.restaurant.products,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadProducts: (httpClient, restaurant) => dispatch(loadProducts(httpClient, restaurant)),
    changeProductEnabled: (httpClient, product, enabled) => dispatch(changeProductEnabled(httpClient, product, enabled)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(ProductsScreen))
