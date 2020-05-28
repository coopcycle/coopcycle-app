import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import BigButton from './components/BigButton'
import { refuseOrder } from '../../redux/Restaurant/actions'

class OrderRefuseScreen extends Component {

  _refuseOrder(reason) {
    this.props.refuseOrder(
      this.props.navigation.getParam('order'),
      reason,
      order => this.props.navigation.navigate('RestaurantOrder', { order })
    )
  }

  render() {

    return (
      <Container>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('RESTAURANT_ORDER_REFUSE_DISCLAIMER') }
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <BigButton
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_SOLD_OUT_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
            onPress={ () => this._refuseOrder('SOLD_OUT') } />
          <BigButton
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_RUSH_HOUR_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
            onPress={ () => this._refuseOrder('RUSH_HOUR') } />
          <BigButton danger
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_CLOSING_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_STOP_RECEIVING')}` }
            onPress={ () => this._refuseOrder('CLOSING') } />
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
    refuseOrder: (order, reason, cb) => dispatch(refuseOrder(order, reason, cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderRefuseScreen))
