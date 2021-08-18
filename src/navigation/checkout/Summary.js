import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  InteractionManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Container, Content,
  Icon, Text,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import Modal from 'react-native-modal'

import DangerAlert from '../../components/DangerAlert'
import { formatPrice } from '../../utils/formatting'
import { incrementItem, decrementItem, removeItem, validate, showAddressModal, hideAddressModal, updateCart } from '../../redux/Checkout/actions'
import { selectDeliveryTotal, selectShippingTimeRangeLabel, selectCartFulfillmentMethod } from '../../redux/Checkout/selectors'
import { selectIsAuthenticated } from '../../redux/App/selectors'
import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'
import CouponModal from './components/CouponModal'

const BottomLine = ({ label, value }) => (
  <View style={ styles.line }>
    <Text style={ styles.bottomLineLabel }>{ label }</Text>
    <Text style={ styles.bottomLineAmount }>{ `${formatPrice(value)}` }</Text>
  </View>
)

const mapAdjustments = (adjustments, type) => _.map(adjustments, (adjustment, index) => (
  <BottomLine key={ `${type}_${index}` }
    label={ adjustment.label } value={ adjustment.amount } />
))

const CollectionDisclaimerModal = withTranslation()(({ isVisible, onSwipeComplete, t, restaurant }) => {

  return (
    <Modal
      isVisible={ isVisible }
      onSwipeComplete={ onSwipeComplete }
      swipeDirection={ ['up', 'down'] }>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 30 }}>
          <Text style={{ fontSize: 14 }}>{ t('CART_COLLECTION_DISCLAIMER', { telephone: restaurant.telephone }) }</Text>
        </View>
      </View>
    </Modal>
  )
})

const ActionButton = withTranslation()(({ isLoading, onPress, iconName, children }) => {

  return (
    <TouchableOpacity style={ [ styles.btn, styles.btnGrey ] }
      // Disable interaction while loading
      onPress={ () => !isLoading && onPress() }>
      <Icon type="FontAwesome" name={ iconName } style={{ fontSize: 22, marginRight: 15 }} />
      { children }
    </TouchableOpacity>
  )
})

class Summary extends Component {

  constructor(props) {
    super(props)
    this.state = {
      translateXValue: new Animated.Value(500),
      isCouponModalVisible: false,
      isCollectionDisclaimerModalVisible: false,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.validate()
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.edit !== prevProps.edit) {
      Animated.timing(
        this.state.translateXValue,
        {
          toValue: this.props.edit ? 0 : 500,
          duration: 450,
          useNativeDriver: false,
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

    const adjustmentsWithoutTax = _.pickBy(item.adjustments, (value, key) => key !== 'tax')

    return (
      <View>
      { _.map(adjustmentsWithoutTax, (adjustments, type) => {
        return _.map(adjustments, (adj, i) => {

          const label = [ adj.label ]
          if (adj.amount > 0) {
            label.push(formatPrice(adj.amount))
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
      this._navigate('CheckoutMoreInfos')
    } else {
      this._navigate('CheckoutLogin')
    }
  }

  onSubmitCoupon(code) {
    this.setState({ isCouponModalVisible: false })
    this.props.updateCart({ promotionCoupon: code })
  }

  toggleReusablePackaging() {
    this.props.updateCart({ reusablePackagingEnabled: !this.props.cart.reusablePackagingEnabled })
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
          <Text note>{ `${formatPrice(item.total)}` }</Text>
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

    const deliveryPromotions = cart.adjustments.delivery_promotion || []
    const orderPromotions = cart.adjustments.order_promotion || []
    const reusablePackagings = cart.adjustments.reusable_packaging || []

    const reusablePackagingAction = cart.potentialAction &&
      _.find(cart.potentialAction, action => action['@type'] === 'EnableReusablePackagingAction')

    return (
      <View style={{ flex: 1 }} onLayout={ () => {
          const { width } = Dimensions.get('window')
          this.setState({
            translateXValue: new Animated.Value(width),
          })
        }}>
        { this.props.isValid === false && (
          <DangerAlert text={ this.props.alertMessage } />
        )}
        <View style={{ flex: 1, paddingTop: 30 }}>
          { this.renderItems() }
        </View>
        <View style={{ flex: 0 }}>
          { this.props.fulfillmentMethod === 'collection' && (
          <TouchableOpacity style={ [ styles.btn ]  }
            // Disable interaction while loading
            onPress={ () => !this.props.isLoading && this.setState({ isCollectionDisclaimerModalVisible: true }) }>
            <Icon type="FontAwesome" name="info-circle" style={{ fontSize: 22, marginRight: 15, color: '#3498db' }} />
            <Text style={{ flex: 2, fontSize: 14, color: '#3498db' }}>{ this.props.t('FULFILLMENT_METHOD.collection') }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('LEARN_MORE') }</Text>
          </TouchableOpacity>
          )}
          <ActionButton
            onPress={ () => this._navigate('CheckoutShippingDate') }
            iconName="clock-o">
            <Text style={{ flex: 2, fontSize: 14 }}>{ this.props.timeAsText }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('EDIT') }</Text>
          </ActionButton>
          { (this.props.fulfillmentMethod === 'delivery' && this.props.cart.shippingAddress) && (
          <ActionButton
            onPress={ () => this.props.showAddressModal() }
            iconName="map-marker">
            <Text numberOfLines={ 2 } ellipsizeMode="tail" style={{ flex: 2, fontSize: 14 }}>
              { this.props.cart.shippingAddress.streetAddress }
            </Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('EDIT') }</Text>
          </ActionButton>
          )}
          <ActionButton
            onPress={ () => this.setState({ isCouponModalVisible: true }) }
            iconName="tag">
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('ADD_COUPON') }</Text>
          </ActionButton>
          { reusablePackagingAction && (
          <ActionButton
            onPress={ () => this.toggleReusablePackaging() }
            iconName="cube">
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ reusablePackagingAction.description }</Text>
          </ActionButton>
          )}
        </View>
        <View style={{ flex: 0, backgroundColor: '#e4022d' }}>
          <BottomLine label={ this.props.t('TOTAL_ITEMS') } value={ cart.itemsTotal } />
          { this.props.fulfillmentMethod === 'delivery' && (
          <BottomLine label={ this.props.t('TOTAL_DELIVERY') } value={ this.props.deliveryTotal } />
          )}
          { mapAdjustments(deliveryPromotions, 'delivery_promotion') }
          { mapAdjustments(orderPromotions, 'order_promotion') }
          { mapAdjustments(reusablePackagings, 'reusable_packaging') }
        </View>
        { this.renderFooter() }
        <AddressModal onGoBack={ () => {
          this.props.hideAddressModal()
          this.props.navigation.navigate('CheckoutSummary')
        }} />
        <ExpiredSessionModal
          onModalHide={ () => this.props.navigation.navigate('CheckoutHome') } />
        <CouponModal
          isVisible={ this.state.isCouponModalVisible }
          onSwipeComplete={ () => this.setState({ isCouponModalVisible: false }) }
          onSubmit={ (code) => this.onSubmitCoupon(code) } />
        <CollectionDisclaimerModal
          isVisible={ this.state.isCollectionDisclaimerModalVisible }
          onSwipeComplete={ () => this.setState({ isCollectionDisclaimerModalVisible: false }) }
          restaurant={ this.props.restaurant } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  btnGrey: {
    backgroundColor: '#ecf0f1',
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
  bottomLineLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  bottomLineAmount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
})

function mapStateToProps(state, ownProps) {

  return {
    cart: state.checkout.cart,
    edit: ownProps.navigation.getParam('edit', false),
    isAuthenticated: selectIsAuthenticated(state),
    deliveryTotal: selectDeliveryTotal(state),
    timeAsText: selectShippingTimeRangeLabel(state),
    isLoading: state.checkout.isLoading,
    isValid: state.checkout.isValid,
    alertMessage: _.first(state.checkout.violations.map(v => v.message)),
    fulfillmentMethod: selectCartFulfillmentMethod(state),
    restaurant: state.checkout.restaurant,
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
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary))
