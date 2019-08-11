import React, { Component } from 'react'
import { Dimensions, PixelRatio, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Container, Content, Footer, H3, H4,
  Left, Right,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import moment from 'moment'
import Modal from 'react-native-modal'

import CartFooter from './components/CartFooter'
import Menu from '../../components/Menu'
import AddressTypeahead from '../../components/AddressTypeahead'

import { init, addItem, hideAddressModal, setAddress } from '../../redux/Checkout/actions'

class Restaurant extends Component {

  componentDidMount() {
    const { restaurant } = this.props.navigation.state.params

    this.props.init(restaurant)
  }

  render() {

    const { height, width } = Dimensions.get('window')

    const { navigate } = this.props.navigation
    const { restaurant } = this.props.navigation.state.params
    const { cart, date, menu } = this.props

    const modalMessageTextStyle = []
    if (false === this.props.isAddressOK) {
      modalMessageTextStyle.push(styles.modalMessageTextError)
    }

    const modalMessage = false === this.props.isAddressOK ?
      this.props.t('CHECKOUT_ADDRESS_NOT_VALID') : this.props.t('CHECKOUT_PLEASE_ENTER_ADDRESS')

    return (
      <Container>
        <Content>
          <Menu
            restaurant={ restaurant }
            menu={ menu }
            date={ date }
            onItemClick={ menuItem => this.props.addItem(menuItem) } />
        </Content>
        { !cart.isEmpty() && (
        <CartFooter
          onSubmit={ () => navigate('CheckoutSummary') }  />
        )}
        <Modal
          isVisible={ this.props.isModalVisible }
          style={ styles.bottomModal }
          onSwipeComplete={ this.props.hideAddressModal }
          onBackdropPress={ this.props.hideAddressModal }
          swipeDirection={ ['up', 'down'] }>
          <View style={ styles.modalContent } testID="addressModal">
            <View style={{ width, height: height * 0.5 }}>
              <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={ modalMessageTextStyle }>{ modalMessage }</Text>
              </View>
              <View style={{ flex: 8 }}>
                <AddressTypeahead
                  testID="addressModalTypeahead"
                  autoFocus={ true }
                  style={ typeaheadStyles }
                  value={ this.props.address && this.props.address.streetAddress }
                  onPress={ (address) => this.props.setAddress(address) }
                  renderRow={ rowData => {
                    return (
                      <Text testID={ `placeId:${rowData.place_id}` }>
                        { rowData.description || rowData.formatted_address || rowData.name }
                      </Text>
                    )
                  } } />
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}

/*
*/

const typeaheadStyles = {
  textInputContainer: {
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#333333',
  },
}

const styles = StyleSheet.create({
  modalContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalMessageText: {
    color: '#CCCCCC'
  },
  modalMessageTextError: {
    color: '#E74C3C'
  },
  typeaheadContainer: {
    marginTop: 15
  },
  typeaheadIconContainer: {
    position: 'absolute',
    right: 0,
    height: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginRight: 8
  }
});

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
    date: state.checkout.date,
    menu: state.checkout.menu,
    address: state.checkout.address,
    isAddressOK: state.checkout.isAddressOK,
    isModalVisible: state.checkout.isAddressModalVisible,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    init: restaurant => dispatch(init(restaurant)),
    addItem: item => dispatch(addItem(item)),
    setAddress: address => dispatch(setAddress(address)),
    hideAddressModal: _ => dispatch(hideAddressModal())
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant))
