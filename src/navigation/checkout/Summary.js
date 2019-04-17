import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  Container,
  Header, Footer, Title, Content,
  Left, Right, Body,
  List, ListItem,
  InputGroup, Input,
  Icon, Picker, Button, Text
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import CartFooter from './components/CartFooter'
import { formatPrice } from '../../Cart'
import { removeItem } from '../../redux/Checkout/actions'

class Summary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      modalVisible: false,
      editing: null,
    };
  }

  _renderItemOptions(item) {

    return (
      <View>
      { item.options.map(option => {

        let optionText = option.name
        if (option.offers.price > 0) {
          optionText = `${option.name} (+ ${formatPrice(option.offers.price)} €)`
        }

        return (
          <Text note key={ `${item.identifier}:${option.identifier}` }>{ optionText }</Text>
        )
      })}
      </View>
    )
  }

  _renderRow(item) {

    const { navigate } = this.props.navigation

    return (
      <ListItem key={ item.key } onPress={() => navigate('CheckoutEditItem', { item })}>
        <Body>
          <Text>{ `${item.quantity} x ${item.name}` }</Text>
          { item.options.length > 0 && this._renderItemOptions(item) }
          <Text note>{ `${formatPrice(item.total)} €` }</Text>
        </Body>
        <Right>
          <Button danger transparent onPress={() => this.props.removeItem(item)}>
            <Icon name="trash" />
          </Button>
        </Right>
      </ListItem>
    )
  }

  onSubmit() {

    const { navigate } = this.props.navigation

    if (this.props.isAuthenticated) {
      navigate('CheckoutAddress')
    } else {
      navigate('CheckoutLogin')
    }
  }

  renderTotal() {

    const { cart } = this.props

    return (
      <List>
        <ListItem>
          <Body>
            <Text>{this.props.t('TOTAL_ITEMS')}</Text>
          </Body>
          <Right>
            <Text style={{ fontWeight: 'bold' }}>{ formatPrice(cart.totalItems) } €</Text>
          </Right>
        </ListItem>
        <ListItem>
          <Body>
            <Text>{this.props.t('TOTAL_DELIVERY')}</Text>
          </Body>
          <Right>
            <Text style={{ fontWeight: 'bold' }}>{ formatPrice(cart.totalDelivery) } €</Text>
          </Right>
        </ListItem>
        <ListItem>
          <Body>
            <Text>{this.props.t('TOTAL')}</Text>
          </Body>
          <Right>
            <Text style={{ fontWeight: 'bold' }}>{ formatPrice(cart.total) } €</Text>
          </Right>
        </ListItem>
      </List>
    )
  }

  render() {

    const { cart } = this.props

    return (
      <Container>
        <Content style={ styles.content }>
          <Title style={ styles.title }>{this.props.t('YOUR_CART')}</Title>
          <List style={{ marginBottom: 20 }}>
            { cart.items.map(this._renderRow.bind(this)) }
          </List>
          <Title style={ styles.title }>{this.props.t('TOTAL')}</Title>
          { this.renderTotal() }
        </Content>
        <CartFooter onSubmit={ this.onSubmit.bind(this) }  />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff'
  },
  title: {
    textAlign: 'left',
    color: '#d9d9d9',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16
  },
});

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
    isAuthenticated: state.app.isAuthenticated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeItem: item => dispatch(removeItem(item)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(Summary))
