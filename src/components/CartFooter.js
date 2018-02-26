import React, { Component } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { Text, Button, Icon, Footer } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment/min/moment-with-locales'
import AppConfig from '../AppConfig'

moment.locale(AppConfig.LOCALE)

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

export default class CartFooter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      opacityAnim: new Animated.Value(1)
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
            { `Minimum ${cart.restaurant.minimumCartAmount} €` }
          </Text>
          <Icon style={{ color: '#fff' }} name="information-circle" />
        </Button>
      )
    }

    return (
      <Button transparent
        style={{ alignSelf: 'flex-end' }}
        onPress={ () => this.props.onSubmit() }>
        <Text style={ styles.buttonText }>Commander</Text>
        <Icon style={{ color: '#fff' }} name="arrow-forward" />
      </Button>
    )
  }

  renderSummary() {

    const { opacityAnim } = this.state
    const { cart } = this.props

    return (
      <View style={ styles.cartSummary }>
        <Animated.View style={{ opacity: opacityAnim }}>
          <Text style={[ styles.cartSummaryText, styles.cartSummaryTotal ]}>
            { `${cart.total} € (${cart.length})` }
          </Text>
        </Animated.View>
        <Text style={[ styles.cartSummaryText, styles.cartSummarySeparator ]}>|</Text>
        <Text style={[ styles.cartSummaryText ]}>{ moment(cart.deliveryDate).format('ddd LT') }</Text>
      </View>
    )
  }

  render() {

    let index = 0;
    const data = [
      { key: index++, label: "Aujourd'hui" },
      { key: index++, label: "Demain" },
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
