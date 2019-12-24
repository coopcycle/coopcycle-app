import React, { Component } from 'react'
import { ActivityIndicator, Animated, View } from 'react-native'
import { Text, Button } from 'native-base'
import { withTranslation } from 'react-i18next'

import { formatPrice } from '../../../utils/formatting'

class CartFooterButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      opacityAnim: new Animated.Value(1),
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

  renderLeft() {
    if (this.props.loading) {
      return (
        <ActivityIndicator size="small" color="#ffffff" />
      )
    }

    return (
      <Text style={{ position: 'absolute', left: 0, fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
        { `[${this.props.cart.items.length}]` }
      </Text>
    )
  }

  render() {

    const { cart } = this.props

    if (cart.items.length === 0) {

      return (
        <View />
      )
    }

    return (
      <Button block onPress={ () => this.props.onPress() } testID="cartSubmit">
        { this.renderLeft() }
        <Text>{ this.props.t('ORDER') }</Text>
        <Text style={{ position: 'absolute', right: 0, fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
          { `${formatPrice(cart.total)} €` }
        </Text>
      </Button>
    )
  }
}

export default withTranslation()(CartFooterButton)
