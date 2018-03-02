import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content, Footer, H3, H4,
  Left, Right,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import moment from 'moment/min/moment-with-locales'
import AppConfig from '../AppConfig'

moment.locale(AppConfig.LOCALE)

const Cart = require('../Cart');

import CartFooter from '../components/CartFooter'
import Menu from '../components/Menu'

class RestaurantPage extends Component {

  constructor(props) {
    super(props);

    const { restaurant, deliveryAddress, deliveryDate } = this.props.navigation.state.params

    const cart = new Cart(restaurant, [])
    cart.setDeliveryDate(deliveryDate)

    this.state = {
      modalVisible: false,
      cart
    };
  }

  onItemClick(menuItem) {
    const { cart } = this.state
    cart.addMenuItem(menuItem)

    this.cartFooter.getWrappedInstance().animate()
    this.setState({ cart })
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurant, deliveryAddress, deliveryDate, client, user } = this.props.navigation.state.params
    const { cart } = this.state

    return (
      <Container>
        <Content>
          <View style={{ paddingHorizontal: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f1f1' }}>
            <Text style={{ fontFamily: 'Raleway-Regular', textAlign: 'center', marginVertical: 10 }}>{ restaurant.name }</Text>
          </View>
          <Menu restaurant={ restaurant } onItemClick={ this.onItemClick.bind(this) } />
        </Content>
        <CartFooter
          ref={ component => this.cartFooter = component }
          cart={ cart }
          onSubmit={ () => navigate('Cart', { cart, client, deliveryAddress, deliveryDate, user, onCartUpdate: cart => this.setState({ cart }) }) }  />
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});

module.exports = RestaurantPage;
