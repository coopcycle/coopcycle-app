import React, { Component, useEffect } from 'react'
import { ImageBackground, InteractionManager, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Container, Text } from 'native-base';
import _ from 'lodash'
import {
  useCollapsibleStack,
  CollapsibleStackSub,
} from 'react-navigation-collapsible'

import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'
import Menu from '../../components/Menu'

import { init, addItem, hideAddressModal, resetRestaurant, setAddress } from '../../redux/Checkout/actions'

const Restaurant = (props) => {

  useEffect(() => {

    const restaurant = props.route.params.restaurant

    props.resetRestaurant(restaurant)
    InteractionManager.runAfterInteractions(() => {
      props.init(restaurant)
    })

  }, []);

  const { navigate } = props.navigation
  const restaurant = props.route.params.restaurant
  const { isCartEmpty, menu } = props

  // FIXME
  // It works only for the first screen!
  // To reproduce:
  // - Go to a restaurant screen, scroll --> it works
  // - Go to another restaurant screen, scroll --> it doesn't work
  const {
    onScroll,
    containerPaddingTop,
    scrollIndicatorInsetTop,
    translateY,
    opacity,
    progress,
  } = useCollapsibleStack()

  return (
    <Container>
      <Menu
        onScroll={ onScroll }
        containerPaddingTop={ containerPaddingTop }
        scrollIndicatorInsetTop={ scrollIndicatorInsetTop }
        opacity={ opacity }
        restaurant={ restaurant }
        menu={ menu }
        onItemClick={ menuItem => props.addItem(menuItem) }
        isItemLoading={ menuItem => {
          return _.includes(props.loadingItems, menuItem.identifier)
        } } />
      { !isCartEmpty && (
      <CartFooter
        onSubmit={ () => navigate('CheckoutSummary') }
        testID="cartSubmit"
        disabled={ props.isLoading } />
      )}
      <AddressModal
        onGoBack={ (address) => {
          props.hideAddressModal()
          navigate('CheckoutHome', { address })
        }} />
      <ExpiredSessionModal
        onModalHide={ () => navigate('CheckoutHome') } />
    </Container>
  )
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
    marginTop: 5,
    fontWeight: 'bold',
    paddingHorizontal: 10,
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant))
