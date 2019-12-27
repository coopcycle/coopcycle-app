import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Container, Content,
  Text,
} from 'native-base';
import _ from 'lodash'

import CartFooter from './components/CartFooter'
import AddressModal from './components/AddressModal'

import Menu from '../../components/Menu'

import { init, addItem, hideAddressModal, resetRestaurant, setAddress } from '../../redux/Checkout/actions'

class Restaurant extends Component {

  constructor(props) {
    super(props)
    this.init = _.once(this.props.init.bind(this))
  }

  componentDidMount() {

    const restaurant = this.props.navigation.getParam('restaurant')

    this.props.resetRestaurant(restaurant)

    // "didFocus" is called when going back,
    // so make sure we call init() once
    this.didFocusListener = this.props.navigation.addListener(
      'didFocus',
      payload => this.init(restaurant)
    )
  }

  componentWillUnmount() {
    this.didFocusListener.remove()
  }

  render() {

    const { height, width } = Dimensions.get('window')

    const { navigate } = this.props.navigation
    const restaurant = this.props.navigation.getParam('restaurant')
    const { isCartEmpty, menu } = this.props

    return (
      <Container>
        <View style={{ height: (height * 0.1) }}>
          <Image
            style={{ flex: 1, width, height: ((height * 0.1) / 2) }}
            source={{ uri: restaurant.image }}
            resizeMode="cover" />
          <View style={ styles.heading }>
            <Text style={{ flex: 2, fontFamily: 'Raleway-Regular' }}>{ restaurant.name }</Text>
          </View>
        </View>
        <Content>
          <Menu
            restaurant={ restaurant }
            menu={ menu }
            onItemClick={ menuItem => this.props.addItem(menuItem) }
            isItemLoading={ menuItem => {
              return _.includes(this.props.loadingItems, menuItem.identifier)
            } } />
        </Content>
        { !isCartEmpty && (
        <CartFooter
          onSubmit={ () => navigate('CheckoutSummary') }
          testID="cartSubmit"
          disabled={ this.props.isLoading } />
        )}
        <AddressModal onGoBack={ (address) => {
          this.props.hideAddressModal()
          this.props.navigation.navigate('CheckoutHome', { address })
        }} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
