import React, { Component } from 'react'
import { ImageBackground, InteractionManager, StyleSheet, View, Animated } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Text } from 'native-base';
import _ from 'lodash'

import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'
import ExpiredSessionModal from './components/ExpiredSessionModal'

import Menu from '../../components/Menu'

import { init, addItem, hideAddressModal, resetRestaurant, setAddress } from '../../redux/Checkout/actions'

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

class Restaurant extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scrollOffsetY: new Animated.Value(0),
    }
    this.scrollOffsetY = new Animated.Value(0)
  }

  componentDidMount() {
    this.props.resetRestaurant(this.props.route.params?.restaurant)
    InteractionManager.runAfterInteractions(() => {
      this.props.init(this.props.route.params?.restaurant)
    })
  }

  render() {

    const { navigate } = this.props.navigation
    const restaurant = this.props.route.params?.restaurant
    const { isCartEmpty, menu } = this.props

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingTop: 60 }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
            <GroupImageHeader restaurant={ restaurant } />
          </View>
          <Menu
            restaurant={ restaurant }
            menu={ menu }
            onItemClick={ menuItem => this.props.addItem(menuItem) }
            isItemLoading={ menuItem => {
              return _.includes(this.props.loadingItems, menuItem.identifier)
            } } />
        </View>
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
      </View>
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
