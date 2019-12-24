import React, { Component } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Container, Content,
  Footer,
  Right, Body,
  List, ListItem,
  Icon, Button, Text,
} from 'native-base';
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import DangerAlert from '../../components/DangerAlert'
import { formatPrice } from '../../utils/formatting'
import i18n from '../../i18n'
import { incrementItem, decrementItem, removeItem, validate } from '../../redux/Checkout/actions'
import { selectDeliveryTotal } from '../../redux/Checkout/selectors'

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      translateXValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    this.props.validate()
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

  _renderItemAdjustments(item, index) {

    return (
      <View>
      { _.map(item.adjustments, (adjustments, type) => {
        return _.map(adjustments, (adj, i) => {

          const label = [ adj.label ]
          if (adj.amount > 0) {
            label.push(`(${formatPrice(adj.amount)} €)`)
          }

          return (
            <Text note key={ `item:${index}:adjustments:${i}` }>{ label.join(' ') }</Text>
          )
        })
      }) }
      </View>
    )
  }

  onSubmit() {
    if (this.props.isAuthenticated) {
      this._navigate('CheckoutCreditCard')
    } else {
      this._navigate('CheckoutLogin')
    }
  }

  renderItems() {

    return (
      <FlatList
        data={ this.props.items }
        keyExtractor={ (item, index) => `item:${index}` }
        renderItem={ ({ item, index }) => this.renderItem(item, index) }
        extraData={{ edit: this.props.edit }} />
    )
  }

  renderItem(item, index) {

    return (
      <View
        style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#d9d9d9', borderBottomWidth: StyleSheet.hairlineWidth }}
        key={ item.key }>
        <View style={{ flex: 3, justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 15 }}>
          <Text>{ `${item.quantity} x ${item.name}` }</Text>
          { _.size(item.adjustments) > 0 && this._renderItemAdjustments(item, index) }
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

    if (cart.items.length === 0) {

      return (
        <View />
      )
    }

    const btnProps = {
      disabled: this.props.isValid !== true
    }

    return (
      <Footer>
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
          <Button block onPress={ this.onSubmit.bind(this) } testID="cartSummarySubmit" { ...btnProps }>
            { this.props.isLoading && <ActivityIndicator size="small" color="#ffffff" /> }
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

    const { cart, timing } = this.props

    if (cart.items.length === 0) {

      return this.renderEmpty()
    }

    return (
      <View style={{ flex: 1 }} onLayout={ () => {
          const { width } = Dimensions.get('window')
          this.setState({
            translateXValue: new Animated.Value(width / 4),
          })
        }}>
        <Content contentContainerStyle={{ justifyContent: 'space-between' }}>
          { false === this.props.isValid && (
            <DangerAlert text={ this.props.alertMessage } />
          )}
          { timing.asap && (
            <TouchableOpacity style={ styles.dateBtn }
              onPress={ () => this._navigate('CheckoutShippingDate') }>
              <Text>{ this.props.timeAsText }</Text>
              <Text note>{ this.props.t('EDIT') }</Text>
            </TouchableOpacity>
          )}
          { this.renderItems() }
        </Content>
        <View style={{ flex: 0, backgroundColor: '#e4022d' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_ITEMS') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(cart.itemsTotal)} €` }</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_DELIVERY') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(this.props.deliveryTotal)} €` }</Text>
          </View>
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
    justifyContent: 'center',
  },
})

function mapStateToProps(state, ownProps) {

  let timeAsText
  if (state.checkout.timing.today && state.checkout.timing.fast) {
    timeAsText = i18n.t('CART_DELIVERY_TIME_DIFF', { diff: state.checkout.timing.diff })
  } else {
    const time = state.checkout.date ? state.checkout.date : state.checkout.timing.asap
    let fromNow = moment(time).calendar(null, { sameElse: 'LLLL' }).toLowerCase()
    timeAsText = i18n.t('CART_DELIVERY_TIME', { fromNow })
  }

  return {
    cart: state.checkout.cart,
    date: state.checkout.date,
    timing: state.checkout.timing,
    edit: ownProps.navigation.getParam('edit', false),
    items: state.checkout.cart.items,
    isAuthenticated: state.app.isAuthenticated,
    deliveryTotal: selectDeliveryTotal(state),
    timeAsText,
    isLoading: state.checkout.isLoading,
    isValid: state.checkout.isValid,
    alertMessage: _.first(state.checkout.violations.map(v => v.message)),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    incrementItem: item => dispatch(incrementItem(item)),
    decrementItem: item => dispatch(decrementItem(item)),
    removeItem: item => dispatch(removeItem(item)),
    validate: () => dispatch(validate()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary))
