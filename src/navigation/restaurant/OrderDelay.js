import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import BigButton from './components/BigButton'
import { delayOrder } from '../../redux/Restaurant/actions'

class OrderDelayScreen extends Component {

  _delayOrder(delay) {
    this.props.delayOrder(
      this.props.route.params?.order,
      delay,
      order => this.props.navigation.navigate('RestaurantOrder', { order })
    )
  }

  render() {
    return (
      <Container
        navigation={ this.props.navigation }
        title={ this.props.t('RESTAURANT_ORDER_DELAY_MODAL_TITLE') }>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('RESTAURANT_ORDER_DELAY_DISCLAIMER') }
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <BigButton
            heading={ '10 minutes' }
            onPress={ () => this._delayOrder(10) } />
          <BigButton
            heading={ '20 minutes' }
            onPress={ () => this._delayOrder(20) } />
          <BigButton danger
            heading={ '30 minutes' }
            onPress={ () => this._delayOrder(30) } />
        </View>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {}
}

function mapDispatchToProps(dispatch) {

  return {
    delayOrder: (order, delay, cb) => dispatch(delayOrder(order, delay, cb)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderDelayScreen))
