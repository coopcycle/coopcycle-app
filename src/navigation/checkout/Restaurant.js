import React, { Component } from 'react'
import { ImageBackground, InteractionManager, StyleSheet, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Container, Text } from 'native-base';
import _ from 'lodash'

import {withCollapsible} from 'react-navigation-collapsible'

import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'

import Menu from '../../components/Menu'

import { init, addItem, hideAddressModal, resetRestaurant, setAddress } from '../../redux/Checkout/actions'

const GroupImageHeader = (props) => {

  const { navigation, collapsible } = props

  const restaurant = navigation.getParam('restaurant')

  // eslint-disable-next-line no-unused-vars
  const { translateY, translateOpacity, translateProgress } = collapsible;

  return (
    <Animated.View style={{
      width: '100%',
      height: '100%',
      opacity: translateOpacity }}>
      <ImageBackground source={{ uri: restaurant.image }} style={{ width: '100%', height: '100%' }}>
        <View style={styles.overlay}>
          <Animated.Image
            source={{ uri: restaurant.image }}
            resizeMode="cover"
            style={{
              transform: [{ scale: translateOpacity }],
              opacity: translateOpacity,
              alignSelf: 'center',
              width: 80,
              height: 80,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 50,
            }}
          />
          <Text style={ styles.restaurantName } numberOfLines={ 1 }>{ restaurant.name }</Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

class Restaurant extends Component {

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

    return (
      <Container>
        <Menu
          collapsible={ this.props.collapsible }
          restaurant={ restaurant }
          menu={ menu }
          onItemClick={ menuItem => this.props.addItem(menuItem) }
          isItemLoading={ menuItem => {
            return _.includes(this.props.loadingItems, menuItem.identifier)
          } } />
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
  heading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
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

const collapsibleParams = {
  collapsibleComponent: GroupImageHeader,
  collapsibleBackgroundStyle: {
    height: 160,
    backgroundColor: '#ffffff',
    disableFadeoutInnerComponent: true,
  },
};

module.exports = withCollapsible(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant)),
  collapsibleParams
);
