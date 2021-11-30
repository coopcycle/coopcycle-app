import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import {
  Text,
  Icon,
  VStack,
  Center,
  HStack,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import OrderItems from '../../components/OrderItems'
import { subscribe, unsubscribe } from '../../redux/Account/actions'

class OrderTrackingPage extends Component {

  componentDidMount() {
    const { order } = this.props.route.params
    if (order) {
      this.props.subscribe(order, (event) => {
        switch (event.name) {
          case 'order:accepted':
            this.props.navigation.setParams({ order: { ...order, state: 'accepted' } })
            break;
          case 'order:fulfilled':
            this.props.navigation.setParams({ order: { ...order, state: 'fulfilled' } })
            break;
        }
      })
    }
  }

  componentWillUnmount() {
    const { order } = this.props.route.params
    if (order) {
      this.props.unsubscribe(order)
    }
  }

  renderHeader() {

    const { order } = this.props.route.params

    let stateText = ''
    let iconName = 'question-circle-o'
    const headerContainerStyle = []

    switch (order.state) {
      case 'new':
        stateText = this.props.t('ORDER_NEW')
        headerContainerStyle.push(styles.headerOrderNew)
        iconName = 'clock-o'
        break
      case 'accepted':
        stateText = this.props.t('ORDER_ACCEPTED')
        headerContainerStyle.push(styles.headerOrderAccepted)
        iconName = 'check'
        break
      case 'fulfilled':
        stateText = this.props.t('ORDER_FULFILLED')
        headerContainerStyle.push(styles.headerOrderFulfilled)
        iconName = 'check'
        break
    }

    return (
      <Center style={ headerContainerStyle } p="2">
        <HStack alignItems="center">
          <Icon style={ [ styles.headerText, { marginRight: 10 } ] } as={ FontAwesome } name={ iconName } />
          <Text style={ styles.headerText }>{ stateText }</Text>
        </HStack>
      </Center>
    )
  }

  renderSubHeader() {

    const { order } = this.props.route.params

    switch (order.state) {
      case 'new':
        return (
          <Center py="1">
            <Text py="2" note>{ this.props.t('ORDER_NEW_HELP') }</Text>
            {this.props.user.isGuest() &&
            <View style={ styles.guestSection }>
              <Text note style={ styles.guestHelpText }>
                { this.props.t('GUEST_CHECK_EMAIL_FOR_ORDER_UPDATES') }
              </Text>
            </View>
            }
          </Center>
        )
    }

    return (
      <View />
    )
  }

  render() {

    const { order } = this.props.route.params

    return (
      <VStack flex={ 1 }>
        { this.renderHeader() }
        { this.renderSubHeader() }
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
      </VStack>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    color: 'white',
  },
  headerOrderNew: {
    backgroundColor: '#FF851B',
  },
  headerOrderAccepted: {
    backgroundColor: '#2ECC71',
  },
  headerOrderFulfilled: {
    backgroundColor: '#2ECC71',
  },
  restaurantText: {
    color: '#cccccc',
  },
  orderNumber: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0074D9',
  },
  orderNumberText: {
    fontSize: 24,
    fontWeight: '400',
    color: 'white',
  },
  guestSection: {
    backgroundColor: '#cce5ff',
    padding: 10,
  },
  guestHelpText: {
    textAlign: 'center',
    color: '#004085',
  },
})

function mapStateToProps(state) {

  return {
    user: state.app.user,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    subscribe: (order, onMessage) => dispatch(subscribe(order, onMessage)),
    unsubscribe: (order) => dispatch(unsubscribe(order)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderTrackingPage))
