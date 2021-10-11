import React, { Component } from 'react'
import { Animated, View } from 'react-native'
import { HStack } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

import CartFooterButton from './CartFooterButton'

class CartFooter extends Component {

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
        useNativeDriver: false,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }

  render() {

    const { cart } = this.props

    return (
      <HStack testID="cartFooter">
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
          <CartFooterButton
            cart={ cart }
            onPress={ () => this.props.onSubmit() }
            loading={ this.props.isLoading }
            testID={ this.props.testID }
            disabled={  this.props.disabled } />
        </View>
      </HStack>
    )
  }
}

CartFooter.defaultProps = {
  disabled: false,
}

CartFooter.propTypes = {
  testID: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

function mapStateToProps(state) {

  return {
    isLoading: state.checkout.isLoading,
    cart: state.checkout.cart,
  }
}

export default connect(mapStateToProps)(withTranslation()(CartFooter))
