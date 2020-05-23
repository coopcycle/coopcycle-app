import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Content, Text } from 'native-base'
import { Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import BigButton from './components/BigButton'
import { cancelOrder } from '../../redux/Restaurant/actions'

class OrderCancelScreen extends Component {

  _cancelOrder(reason) {
    this.props.cancelOrder(
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
            { this.props.t('RESTAURANT_ORDER_CANCEL_DISCLAIMER') }
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <BigButton
            heading={ this.props.t('RESTAURANT_ORDER_CANCEL_REASON_CUSTOMER_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
            onPress={ () => this._cancelOrder('CUSTOMER') } />
          <BigButton
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_SOLD_OUT_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
            onPress={ () => this._cancelOrder('SOLD_OUT') } />
          <BigButton
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_RUSH_HOUR_HEADING') }
            text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
            onPress={ () => this._cancelOrder('RUSH_HOUR') } />
          <BigButton
            danger
            heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_NO_SHOW') }
            text={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_CAPTURED') }
            onPress={ () => this._cancelOrder('NO_SHOW') } />
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
    cancelOrder: (order, reason, cb) => dispatch(cancelOrder(order, reason, cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderCancelScreen))
