import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import {
  Container, Content, Footer, H3, H4,
  Left, Right,
  List, ListItem,
  InputGroup, Input,
  Icon, Text, Picker, Button
} from 'native-base';
import moment from 'moment'

import CartFooter from './components/CartFooter'
import Menu from '../../components/Menu'
import { init, addItem } from '../../redux/Checkout/actions'

class Restaurant extends Component {

  componentDidMount() {
    const { restaurant} = this.props.navigation.state.params

    this.props.init(restaurant)
  }

  onItemClick(menuItem) {

    const { navigate } = this.props.navigation

    if (menuItem.hasOwnProperty('menuAddOn') && Array.isArray(menuItem.menuAddOn) && menuItem.menuAddOn.length > 0) {
      navigate('CheckoutProductOptions', { product: menuItem })
    } else {
      this.props.addItem(menuItem)
    }
  }

  render() {

    const { navigate } = this.props.navigation
    const { restaurant } = this.props.navigation.state.params

    const { width } = Dimensions.get('window')

    return (
      <Container>
        <View>
          <Image
            style={{ width, height: 50 }}
            source={{ uri: restaurant.image }}
            resizeMode="cover" />
          <View style={ styles.heading }>
            <Text style={{ fontFamily: 'Raleway-Regular', textAlign: 'center', marginVertical: 10 }}>{ restaurant.name }</Text>
          </View>
        </View>
        <Content>

          <Menu restaurant={ restaurant } onItemClick={ this.onItemClick.bind(this) } />
        </Content>
        <CartFooter
          onSubmit={ () => navigate('CheckoutSummary') }  />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1'
  }
})

function mapStateToProps(state) {
  return {
    cart: state.checkout.cart,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    init: (restaurant, address, date) => dispatch(init(restaurant, address, date)),
    addItem: item => dispatch(addItem(item)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(Restaurant))
