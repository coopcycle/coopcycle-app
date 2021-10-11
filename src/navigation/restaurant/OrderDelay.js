import React, { Component } from 'react'
import { View } from 'react-native'
import { Center, Text } from 'native-base'
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
      <Center flex={ 1 }>
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
      </Center>
    )
  }
}

function mapDispatchToProps(dispatch) {

  return {
    delayOrder: (order, delay, cb) => dispatch(delayOrder(order, delay, cb)),
  }
}

export default connect(() => ({}), mapDispatchToProps)(withTranslation()(OrderDelayScreen))
