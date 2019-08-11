import React, { Component } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text, Button, Icon, Footer } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { formatPrice } from '../../../Cart'
import CartFooterButton from './CartFooterButton'

const styles = StyleSheet.create({
  column: {
    flex: 1,
    justifyContent: 'center'
  },
  cartSummary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  },
  cartSummaryText: {
    color: '#fff',
    fontSize: 14
  },
  cartSummarySeparator: {
    paddingHorizontal: 5
  },
  cartSummaryTotal: {
    fontWeight: 'bold'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  }
})

class CartFooter extends Component {

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

    return (
      <Footer testID="cartFooter">
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 5, paddingVertical: 5 }}>
          <CartFooterButton cart={ cart } onPress={ () => this.props.onSubmit() } />
        </View>
      </Footer>
    )
  }
}

function mapStateToProps(state) {

  return {
    cart: state.checkout.cart,
    date: state.checkout.date,
  }
}

export default connect(mapStateToProps)(withTranslation()(CartFooter))
