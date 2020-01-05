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
  Container, Content,
  Right, Body,
  List, ListItem,
  Icon, Text,
} from 'native-base';
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import DangerAlert from '../../components/DangerAlert'
import { formatPrice } from '../../utils/formatting'
import i18n from '../../i18n'
import { incrementItem, decrementItem, removeItem, validate, showAddressModal, hideAddressModal } from '../../redux/Checkout/actions'
import { selectDeliveryTotal } from '../../redux/Checkout/selectors'
import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'

class Summary extends Component {

  constructor(props) {
    super(props)

    this.state = {
      translateXValue: new Animated.Value(0),
    }

    this.validate = _.once(this.props.validate.bind(this))
  }

  componentDidMount() {
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.validate)
  }

  componentWillUnmount() {
    this.didFocusListener.remove()
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
        data={ this.props.cart.items }
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

    if (!cart || cart.items.length === 0) {

      return (
        <View />
      )
    }

    return (
      <CartFooter
        onSubmit={ this.onSubmit.bind(this) }
        testID="cartSummarySubmit"
        disabled={ this.props.isValid !== true || this.props.isLoading } />
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

    const { cart } = this.props

    if (!cart || cart.items.length === 0) {

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
          { this.props.isValid === false && (
            <DangerAlert text={ this.props.alertMessage } />
          )}
          { this.renderItems() }
        </Content>
        <View style={{ flex: 0, backgroundColor: '#ecf0f1' }}>
          <TouchableOpacity style={ styles.dateBtn }
            onPress={ () => this._navigate('CheckoutShippingDate') }>
            <Icon type="FontAwesome" name="clock-o" style={{ fontSize: 22, marginRight: 15 }} />
            <Text style={{ flex: 2, fontSize: 14 }}>{ this.props.timeAsText }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('EDIT') }</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ [ styles.dateBtn, { flexShrink: 1 } ] }
            onPress={ () => this.props.showAddressModal() }>
            <Icon type="FontAwesome" name="map-marker" style={{ fontSize: 22, marginRight: 15 }} />
            <Text numberOfLines={ 2 } ellipsizeMode="tail" style={{ flex: 2, fontSize: 14 }}>{ this.props.cart.shippingAddress.streetAddress }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('EDIT') }</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0, backgroundColor: '#e4022d' }}>
          <View style={ styles.line }>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_ITEMS') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(cart.itemsTotal)} €` }</Text>
          </View>
          <View style={ styles.line }>
            <Text style={{ color: '#ffffff' }}>{ this.props.t('TOTAL_DELIVERY') }</Text>
            <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{ `${formatPrice(this.props.deliveryTotal)} €` }</Text>
          </View>
        </View>
        { this.renderFooter() }
        <AddressModal onGoBack={ () => {
          this.props.hideAddressModal()
          this.props.navigation.navigate('CheckoutSummary')
        }} />
        <ExpiredSessionModal
          onModalHide={ () => this.props.navigation.navigate('CheckoutHome') } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#d7d7d7',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 20,
    paddingVertical: 5,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function mapStateToProps(state, ownProps) {

  let timeAsText = i18n.t('LOADING')
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
    showAddressModal: () => dispatch(showAddressModal()),
    hideAddressModal: () => dispatch(hideAddressModal()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary))
