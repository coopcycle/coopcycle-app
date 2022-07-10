import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  FlatList, ImageBackground,
  InteractionManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  Center, Icon, Text,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import Modal from 'react-native-modal'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import DangerAlert from '../../components/DangerAlert'
import { formatPrice } from '../../utils/formatting'
import {
  decrementItem,
  hideAddressModal,
  incrementItem,
  removeItem,
  setAddress,
  showAddressModal,
  updateCart,
  validate,
} from '../../redux/Checkout/actions'
import { selectDeliveryTotal } from '../../redux/Checkout/selectors'
import { selectIsAuthenticated } from '../../redux/App/selectors'
import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'
import CouponModal from './components/CouponModal'
import { selectCartFulfillmentMethod, selectShippingTimeRangeLabel } from '../../utils/checkout';
import { darkGreyColor, greyColor, lightGreyColor, primaryColor } from '../../styles/common';

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
//<Text style={{ fontSize: 14 }}>{ t('CART_COLLECTION_DISCLAIMER', { telephone: restaurant.telephone }) }</Text>
  return (
    <Modal
      isVisible={ isVisible }
      onSwipeComplete={ onSwipeComplete }
      swipeDirection={ [ 'up', 'down' ] }>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 30 }} />
      </View>
    </Modal>
  )
})

const ActionButton = withTranslation()(({ isLoading, onPress, iconName, children }) => {

  return (
    <TouchableOpacity style={ [ styles.btn, styles.btnGrey ] }
      // Disable interaction while loading
      onPress={ () => !isLoading && onPress() }>
      <Icon as={ FontAwesome } name={ iconName } mr="2" size="sm" />
      { children }
    </TouchableOpacity>
  )
})

const GroupImageHeader = ({ restaurant, scale }) => {

  return (
    <Animated.View style={{
      width: '100%',
      height: '100%',
    }}>
      <ImageBackground source={{ uri: restaurant.image }} style={{ width: '100%', height: '100%' }}>
        <View style={ styles.overlay }>
          <View style={{ height: 60, justifyContent: 'center' }}>
            <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ restaurant.name }</Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

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
      this.props.validate(this.props.cart)
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

  _navigate(routeName, cart = {}) {
    // Set edit = false before navigating
    this.props.navigation.setParams({ 'edit': false })
    this.props.navigation.navigate(routeName, cart)
  }

  _renderItemAdjustments(item, index) {

    const adjustmentsWithoutTax = _.pickBy(item.adjustments, (value, key) => key !== 'tax')

    return (
      <View style={{ paddingLeft: 5 }}>
      { _.map(adjustmentsWithoutTax, (adjustments, type) => {
        return _.map(adjustments, (adj, i) => {

          const label = [adj.label]
          if (adj.amount > 0) {
            label.push(formatPrice(adj.amount))
          }

          return (
            <Text color="#757575" note key={ `item:${index}:adjustments:${i}` }>{ label.join(' ') }</Text>
          )
        })
      }) }
      </View>
    )
  }

  onSubmit() {
    //FEAT: Pass cart and/or restaurant to componant here
    const { cart } = this.props

    //FEAT: Set the cart into the Redux state

    if (this.props.isAuthenticated) {
      this._navigate('CheckoutMoreInfos', { cart })
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
              <Icon as={ FontAwesome } name="plus-circle" size="sm" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              onPress={ () => this.props.decrementItem(item) }>
              <Icon as={ FontAwesome } name="minus-circle" size="sm" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => this.props.removeItem(item)}>
            <Icon as={ FontAwesome } name="trash-o" size="sm" />
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
        cart={ cart }
        testID="cartSummarySubmit"
        disabled={ this.props.isValid !== true || this.props.isLoading } />
    )
  }

  renderEmpty() {

    return (
      <Center flex={ 1 }>
        <Text>{ this.props.t('CART_EMPTY_WARNING') }</Text>
      </Center>
    )
  }

  render() {

    const { cart, restaurant } = this.props

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
          <TouchableOpacity style={ [styles.btn]  }
            // Disable interaction while loading
            onPress={ () => !this.props.isLoading && this.setState({ isCollectionDisclaimerModalVisible: true }) }>
            <Icon as={FontAwesome} name="info-circle" style={{ fontSize: 22, marginRight: 15, color: '#3498db' }} />
            <Text style={{ flex: 2, fontSize: 14, color: '#3498db' }}>{ this.props.t('FULFILLMENT_METHOD.collection') }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('LEARN_MORE') }</Text>
          </TouchableOpacity>
          )}
          <ActionButton
            onPress={ () => this._navigate('CheckoutShippingDate', { cart, restaurant }) }
            iconName="clock-o">
            <Text style={{ flex: 2, fontSize: 14 }}>{ this.props.timeAsText }</Text>
            <Text note style={{ flex: 1, textAlign: 'right' }}>{ this.props.t('EDIT') }</Text>
          </ActionButton>
          { (this.props.fulfillmentMethod === 'delivery' && this.props.cart.shippingAddress) && (
          <ActionButton
            onPress={ () => this.props.navigation.navigate('AccountAddresses', { action: 'cart', cart }) }
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

        <View style={{ flex: 0, backgroundColor: primaryColor }}>
          <BottomLine label={ this.props.t('TOTAL_ITEMS') } value={ cart.itemsTotal } />
          { this.props.fulfillmentMethod === 'delivery' && (
          <BottomLine label={ this.props.t('TOTAL_DELIVERY') } value={ this.props.deliveryTotal } />
          )}
          { mapAdjustments(deliveryPromotions, 'delivery_promotion') }
          { mapAdjustments(orderPromotions, 'order_promotion') }
          { mapAdjustments(reusablePackagings, 'reusable_packaging') }
        </View>
        { this.renderFooter() }
        <ExpiredSessionModal
          onModalHide={ () => this.props.navigation.navigate('CheckoutHome') } />
        <CouponModal
          isVisible={ this.state.isCouponModalVisible }
          onSwipeComplete={ () => this.setState({ isCouponModalVisible: false }) }
          onSubmit={ (code) => this.onSubmitCoupon(code) } />
        <CollectionDisclaimerModal
          isVisible={ this.state.isCollectionDisclaimerModalVisible }
          onSwipeComplete={ () => this.setState({ isCollectionDisclaimerModalVisible: false }) }
          restaurant={ restaurant } />
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


  const restaurant = ownProps.route.params?.restaurant
  const cart = state.checkout.carts[restaurant['@id']].cart || ownProps.route.params?.cart || state.checkout.cart
  return {
    cart,
    restaurant,
    edit: ownProps.route.params?.edit || false,
    isAuthenticated: selectIsAuthenticated(state),
    deliveryTotal: selectDeliveryTotal(state),
    timeAsText: selectShippingTimeRangeLabel(restaurant, cart, {}),
    isLoading: state.checkout.isLoading,
    isValid: state.checkout.isValid,
    alertMessage: _.first(state.checkout.violations.map(v => v.message)),
    fulfillmentMethod: selectCartFulfillmentMethod(restaurant, cart),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    incrementItem: item => dispatch(incrementItem(item)),
    decrementItem: item => dispatch(decrementItem(item)),
    removeItem: item => dispatch(removeItem(item)),
    validate: cart => dispatch(validate(cart)),
    showAddressModal: () => dispatch(showAddressModal()),
    hideAddressModal: () => dispatch(hideAddressModal()),
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
    setAddress: (address, cart) => dispatch(setAddress(address, cart)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Summary))
