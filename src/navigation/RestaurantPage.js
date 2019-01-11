import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Container, Header, Title, Content, Footer, H3, H4,
  Left, Right,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import moment from 'moment'

import CartFooter from './checkout/components/CartFooter'
import Menu from '../components/Menu'
import { init, addItem } from '../redux/Checkout/actions'

class RestaurantPage extends Component {

  componentDidMount() {
    const { restaurant, deliveryAddress, deliveryDate } = this.props.navigation.state.params

    this.props.init(restaurant, deliveryAddress, deliveryDate)
  }

  onItemClick(menuItem) {

    const { navigate } = this.props.navigation

    if (menuItem.hasOwnProperty('menuAddOn') && Array.isArray(menuItem.menuAddOn) && menuItem.menuAddOn.length > 0) {
      navigate('CheckoutProductOptions', { product: menuItem })
    } else {
      this.props.addItem(menuItem)
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurant } = this.props.navigation.state.params

    return (
      <Container>
        <Content>
          <View style={{ paddingHorizontal: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f1f1' }}>
            <Text style={{ fontFamily: 'Raleway-Regular', textAlign: 'center', marginVertical: 10 }}>{ restaurant.name }</Text>
          </View>
          <Menu restaurant={ restaurant } onItemClick={ this.onItemClick.bind(this) } />
        </Content>
        <CartFooter
          onSubmit={ () => navigate('Cart') }  />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    init: (restaurant, address, date) => dispatch(init(restaurant, address, date)),
    addItem: item => dispatch(addItem(item)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(RestaurantPage))
