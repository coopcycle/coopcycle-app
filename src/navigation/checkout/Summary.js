import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Container,
  Header, Footer, Title, Content,
  Left, Right, Body,
  List, ListItem,
  InputGroup, Input,
  Icon, Picker, Button, Text
} from 'native-base';
import moment from 'moment'
import _ from 'lodash'
import { Col, Row, Grid } from 'react-native-easy-grid';
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import CartFooterButton from './components/CartFooterButton'
import { formatPrice } from '../../Cart'
import { incrementItem, decrementItem, removeItem } from '../../redux/Checkout/actions'

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      translateXValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const { width } = Dimensions.get('window')

    this.setState({
      translateXValue: new Animated.Value(width / 4),
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.edit !== prevProps.edit) {
      const { width } = Dimensions.get('window')
      Animated.timing(
        this.state.translateXValue,
        {
          toValue: this.props.edit ? 0 : (width / 4),
          duration: 450,
        }
      ).start()
    }
  }

  _navigate(routeName) {
    // Set edit = false before navigating
    this.props.navigation.setParams({ 'edit': false })
    this.props.navigation.navigate(routeName)
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

  onSubmit() {

    const { navigate } = this.props.navigation

    if (this.props.isAuthenticated) {
      this._navigate('CheckoutAddress')
    } else {
      this._navigate('CheckoutLogin')
    }
  }

  renderItems() {

    return (
      <FlatList
        data={ this.props.items }
        keyExtractor={ (item, index) => `item:${index}` }
        renderItem={ ({ item }) => this.renderItem(item) }
        extraData={{ edit: this.props.edit }} />
    )
  }

  renderItem(item) {

    return (
      <View
        style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#d9d9d9', borderBottomWidth: StyleSheet.hairlineWidth }}
        key={ item.key }>
        <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 15 }}>
          <Text>{ `${item.quantity} x ${item.name}` }</Text>
          { item.options.length > 0 && this._renderItemOptions(item) }
          <Text note>{ `${formatPrice(item.total)} €` }</Text>
        </View>
        <Animated.View
          style={{ flex: 1, flexDirection: 'row', transform: [{ translateX: this.state.translateXValue }] }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={ () => this.props.incrementItem(item) }>
              <Icon type="FontAwesome" name="plus-circle" style={{ fontSize: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={ () => this.props.decrementItem(item) }>
              <Icon type="FontAwesome" name="minus-circle" style={{ fontSize: 20 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this.props.removeItem(item)}>
            <Icon type="FontAwesome" name="trash-o" style={{ fontSize: 20 }} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }

  renderTotal() {

    const { cart } = this.props

    return (
      <View style={{ justifySelf: 'flex-end' }}>
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
        </List>
      </View>
    )
  }

  renderFooter() {

    const { cart } = this.props

    if (cart.length === 0) {

      return (
        <View />
      )
    }

    if (cart.totalItems < cart.restaurant.minimumCartAmount) {
      return (
        <Footer>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <CartFooterButton cart={ cart } onPress={ () => this.props.navigation.goBack() } />
          </View>
        </Footer>
      )
    }

    return (
      <Footer>
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
          <Button block onPress={ this.onSubmit.bind(this) }>
            <Text>{ this.props.t('ORDER') }</Text>
          </Button>
        </View>
      </Footer>
    )
  }

  renderEmpty() {

    return (
      <Container>
        <Content contentContainerStyle={ styles.emptyContent }>
          <Text>{ this.props.t('CART_EMPTY_WARNING') }</Text>
        </Content>
      </Container>
    )
  }

  render() {

    const { cart, date } = this.props

    if (cart.length === 0) {

      return this.renderEmpty()
    }

    return (
      <View style={{ flex: 1 }}>
        <Content contentContainerStyle={{ justifyContent: 'space-between' }}>
          <TouchableOpacity style={ styles.dateBtn }
            onPress={ () => this._navigate('CheckoutShippingDate') }>
            <Text>{ moment(date).format('dddd LT') }</Text>
            <Text note>{ this.props.t('EDIT') }</Text>
          </TouchableOpacity>
          { this.renderItems() }
        </Content>
        <View style={{ flex: 0, backgroundColor: '#e4022d' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_ITEMS') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(cart.totalItems)} €` }</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_DELIVERY') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(cart.totalDelivery)} €` }</Text>
          </View>
          { (cart.totalItems >= cart.restaurant.minimumCartAmount) && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(cart.total)} €` }</Text>
          </View>
          ) }
        </View>
        { this.renderFooter() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 15,
    borderColor: '#d7d7d7',
    borderWidth: StyleSheet.hairlineWidth,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

function mapStateToProps(state, ownProps) {

  return {
    cart: state.checkout.cart,
    date: state.checkout.date,
    edit: ownProps.navigation.getParam('edit', false),
    items: state.checkout.cart.items,
    isAuthenticated: state.app.isAuthenticated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    incrementItem: item => dispatch(incrementItem(item)),
    decrementItem: item => dispatch(decrementItem(item)),
    removeItem: item => dispatch(removeItem(item)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(Summary))
