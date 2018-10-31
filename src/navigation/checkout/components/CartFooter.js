import React, { Component } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text, Button, Icon, Footer } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { formatPrice } from '../../../Cart'

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
    textAlign: 'right',
    paddingLeft: 0,
    paddingRight: 0
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

  renderButton() {

    const { cart } = this.props

    if (cart.length === 0) {
      return (
        <View />
      )
    }

    if (cart.totalItems < cart.restaurant.minimumCartAmount) {
      return (
        <Button transparent style={{ alignSelf: 'flex-end' }}>
          <Text style={ styles.buttonText }>
            { `Minimum ${formatPrice(cart.restaurant.minimumCartAmount)} €` }
          </Text>
          <Icon style={{ color: '#fff' }} name="information-circle" />
        </Button>
      )
    }

    return (
      <Button transparent
        style={{ alignSelf: 'flex-end' }}
        onPress={ () => this.props.onSubmit() }>
        <Text style={ styles.buttonText }>{this.props.t('ORDER')}</Text>
        <Icon style={{ color: '#fff' }} name="arrow-forward" />
      </Button>
    )
  }

  renderSummary() {

    const { opacityAnim } = this.state
    const { cart, date } = this.props

    return (
      <View style={ styles.cartSummary }>
        <Animated.View style={{ opacity: opacityAnim }}>
          <Text style={[ styles.cartSummaryText, styles.cartSummaryTotal ]}>
            { `${formatPrice(cart.total)} € (${cart.length})` }
          </Text>
        </Animated.View>
        <Text style={[ styles.cartSummaryText, styles.cartSummarySeparator ]}>|</Text>
        <Text style={[ styles.cartSummaryText ]}>{ moment(date).format('ddd LT') }</Text>
      </View>
    )
  }

  render() {

    let index = 0;
    const data = [
      { key: index++, label: this.props.t('TODAY') },
      { key: index++, label: this.props.t('TOMORROW') },
    ]

    return (
      <Footer>
        <Grid>
          <Col style={ styles.column }>
            { this.renderSummary() }
          </Col>
          <Col style={ styles.column }>
            { this.renderButton() }
          </Col>
        </Grid>
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

export default connect(mapStateToProps)(translate()(CartFooter))
