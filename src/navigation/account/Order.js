import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Center, Icon, Text, VStack } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import OrderItems from '../../components/OrderItems'

class OrderPage extends Component {

  renderDetail(order) {
    return (
      <VStack flex={ 1 } testID="accountOrder">
        <Center mb="3" py="2">
          <Icon style={ styles.restaurantText }
            as={ FontAwesome } name="cutlery" />
          <Text style={ styles.restaurantText }>
            { order.restaurant.name }
          </Text>
        </Center>
        <OrderItems order={ order } withDeliveryTotal={ true } />
      </VStack>
    )
  }

  render() {

    const order = this.props.order || this.props.route.params.order;

    if (!this.props.loading && order) {
      return (
        <VStack flex={ 1 }>
          { this.renderDetail(order) }
        </VStack>
      )
    }

    return (
        <View/>
    );
  }
}

const styles = StyleSheet.create({
  restaurantText: {
    color: '#cccccc',
  },
})

function mapStateToProps(state, ownProps) {

  return {
    order: state.account.order,
    loading: state.app.loading,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderPage))
