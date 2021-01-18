import React, { Component } from 'react'
import { ImageBackground, InteractionManager, StyleSheet, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Container, Text } from 'native-base';
import _ from 'lodash'

import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'

import Menu from '../../components/Menu'

import { init, addItem, hideAddressModal, resetRestaurant, setAddress } from '../../redux/Checkout/actions'

const H_MAX_HEIGHT = 160 // = 60 (text) + 80 (image) + 20 (marginTop)
const H_MIN_HEIGHT = 60
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

const GroupImageHeader = ({ restaurant, scale }) => {

  return (
    <Animated.View style={{
      width: '100%',
      height: H_MAX_HEIGHT,
      }}>
      <ImageBackground source={{ uri: restaurant.image }} style={{ width: '100%', height: '100%' }}>
        <View style={styles.overlay}>
          <Animated.Image
            source={{ uri: restaurant.image }}
            resizeMode="cover"
            style={{
              transform: [{ scale: scale }],
              alignSelf: 'center',
              width: 80,
              height: 80,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 50,
              marginTop: 20
            }}
          />
          <View style={{ height: 60, justifyContent: 'center' }}>
            <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ restaurant.name }</Text>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

class Restaurant extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrollOffsetY: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.props.resetRestaurant(this.props.navigation.getParam('restaurant'))
    InteractionManager.runAfterInteractions(() => {
      this.props.init(this.props.navigation.getParam('restaurant'))
    })
  }

  render() {

    const { navigate } = this.props.navigation
    const restaurant = this.props.navigation.getParam('restaurant')
    const { isCartEmpty, menu } = this.props

    const translateY = this.state.scrollOffsetY.interpolate({
      inputRange: [ 0, H_SCROLL_DISTANCE ],
      outputRange: [ 0, H_SCROLL_DISTANCE * -1 ],
      extrapolate: 'clamp'
    })

    const scale = this.state.scrollOffsetY.interpolate({
      inputRange: [ 0, H_SCROLL_DISTANCE ],
      outputRange: [ 1, 0 ],
      extrapolate: 'clamp'
    })

    return (
      <Container>
        <Animated.View style={{ transform: [{ translateY: translateY }] }}>
          <GroupImageHeader restaurant={ restaurant } scale={ scale } />
          <Menu
            onScroll={ Animated.event(
              [ { nativeEvent: { contentOffset: { y: this.state.scrollOffsetY }}} ],
              { useNativeDriver: true }
            ) }
            restaurant={ restaurant }
            menu={ menu }
            onItemClick={ menuItem => this.props.addItem(menuItem) }
            isItemLoading={ menuItem => {
              return _.includes(this.props.loadingItems, menuItem.identifier)
            } } />
        </Animated.View>
        { !isCartEmpty && (
        <CartFooter
          onSubmit={ () => navigate('CheckoutSummary') }
          testID="cartSubmit"
          disabled={ this.props.isLoading } />
        )}
        <AddressModal
          onGoBack={ (address) => {
            this.props.hideAddressModal()
            navigate('CheckoutHome', { address })
          }} />
        <ExpiredSessionModal
          onModalHide={ () => navigate('CheckoutHome') } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    color: '#ffffff',
    fontFamily: 'Raleway-Regular',
    fontWeight: 'bold',
  },
});

function mapStateToProps(state) {

  const isCartEmpty = !state.checkout.cart ? true : state.checkout.cart.items.length === 0

  return {
    isCartEmpty,
    date: state.checkout.date,
    menu: state.checkout.menu,
    address: state.checkout.address,
    isLoading: state.checkout.isLoading,
    loadingItems: state.checkout.itemRequestStack,
    isExpiredSessionModalVisible: state.checkout.isExpiredSessionModalVisible,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    init: restaurant => dispatch(init(restaurant)),
    resetRestaurant: restaurant => dispatch(resetRestaurant(restaurant)),
    addItem: item => dispatch(addItem(item)),
    setAddress: address => dispatch(setAddress(address)),
    hideAddressModal: () => dispatch(hideAddressModal()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant))
