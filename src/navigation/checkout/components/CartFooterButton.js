import React, { Component } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text, Button, Icon, Footer } from 'native-base'
import { withNamespaces } from 'react-i18next'

import { formatPrice } from '../../../Cart'

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 14,
  }
})

class CartFooterButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      opacityAnim: new Animated.Value(1)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cart.total !== prevProps.cart.total) {
      this.animate()
    }
  }

  animate() {
    Animated.sequence([
      Animated.timing(this.state.opacityAnim, {
        toValue: 0.4,
        duration: 300,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 200,
      }),
    ]).start()
  }

  render() {

    const { cart } = this.props

    if (cart.length === 0) {

      return (
        <View />
      )
    }

    if (cart.totalItems < cart.restaurant.minimumCartAmount) {

      return (
        <Button block transparent>
          <Icon style={{ color: '#fff', position: 'absolute', left: 0 }} name="information-circle" />
          <Text style={ styles.buttonText }>
            { `Minimum ${formatPrice(cart.restaurant.minimumCartAmount)} €` }
          </Text>
          <Text style={{ color: '#fff', position: 'absolute', right: 0, fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
            { `${formatPrice(cart.totalItems)} €` }
          </Text>
        </Button>
      )
    }

    return (
      <Button block onPress={ () => this.props.onPress() } testID="cartSubmit">
        <Text style={{ position: 'absolute', left: 0, fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
          { `[${cart.length}]` }
        </Text>
        <Text>{ this.props.t('ORDER') }</Text>
        <Text style={{ position: 'absolute', right: 0, fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
          { `${formatPrice(cart.total)} €` }
        </Text>
      </Button>
    )
  }
}

export default withNamespaces('common')(CartFooterButton)
