import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import {
  Center,
  HStack,
  Icon,
  Text,
  VStack,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import OrderItems from '../../components/OrderItems'
import { loadOrder, subscribe, unsubscribe } from '../../redux/Account/actions'
import {deleteCart} from '../../redux/Checkout/actions';

class OrderTrackingPage extends Component {

  constructor(props) {
    super(props)
    this.onFocus = this.onFocus.bind(this)

    props.navigation.addListener('focus', this.onFocus);
  }

  async onFocus() {
    const { hashid } = this.props.route.params

    if (hashid) {
      // we want to get the last order state on each onfocus for this screen
      await this.props.loadOrder(hashid)
    }
  }

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
    this.props.deleteCart(order.restaurant['@id'])
  }

  renderHeader(order) {

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
          <Icon style={ [ styles.headerText, { marginRight: 10 }] } as={ FontAwesome } name={ iconName } />
          <Text style={ styles.headerText }>{ stateText }</Text>
        </HStack>
      </Center>
    )
  }

  renderSubHeader(order) {

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
          { this.renderHeader(order) }
          { this.renderSubHeader(order) }
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
    order: state.account.order,
    loading: state.app.loading,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    subscribe: (order, onMessage) => dispatch(subscribe(order, onMessage)),
    unsubscribe: (order) => dispatch(unsubscribe(order)),
    loadOrder: (hashid) => dispatch(loadOrder(hashid)),
    deleteCart: id => dispatch(deleteCart(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderTrackingPage))
