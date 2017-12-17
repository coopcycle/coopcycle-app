import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Container, Header, Title, Content, Footer, H3, H4,
  Left, Right, Body,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'
import _ from 'underscore'

moment.locale('fr')

const Cart = require('../Cart');

import CartFooter from '../components/CartFooter'

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

  _addToCart(menuItem) {
    const { cart } = this.state
    cart.addMenuItem(menuItem)

    this.cartFooter.animate()
    this.setState({ cart })
  }

  _renderMenuItem(menuItem) {
    const isDivider = menuItem['@type'] === 'http://schema.org/MenuSection'
    const props = isDivider ? { itemDivider: true } : {
      button: true,
      onPress: () => this._addToCart(menuItem)
    }

    return (
      <ListItem key={ menuItem['@id'] } { ...props}>
        <Body>
          <Text>{ menuItem.name }</Text>
        </Body>
        { !isDivider && <Right>
          <Text>{ menuItem.offers.price } €</Text>
        </Right> }
      </ListItem>
    );
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurant, deliveryAddress, deliveryDate, client, user } = this.props.navigation.state.params
    const { cart } = this.state

    let items = []
    _.forEach(restaurant.hasMenu.hasMenuSection, menuSection => {
      items.push(menuSection)
      _.forEach(menuSection.hasMenuItem, menuItem => {
        items.push(menuItem)
      })
    })

    return (
      <Container>
        <Content>
          <H3 style={{ textAlign: 'center', marginVertical: 10 }}>{ restaurant.name }</H3>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>Livraison : { deliveryAddress.streetAddress }</Text>
          <List>
          { _.map(items, item => this._renderMenuItem(item)) }
          </List>
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