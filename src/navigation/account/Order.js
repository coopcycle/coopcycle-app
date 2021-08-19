import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  Container,
  Text,
  Content,
  Icon,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

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
    const headerContainerStyle = [ styles.headerContainer ]

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
      <View style={ styles.header }>
        <View style={ headerContainerStyle }>
          <Icon style={ [ styles.headerText, { marginRight: 10 } ] } type="FontAwesome" name={ iconName } />
          <Text style={ styles.headerText }>{ stateText }</Text>
        </View>
      </View>
    )
  }

  renderSubHeader() {

    const { order } = this.props.route.params

    switch (order.state) {
      case 'new':
        return (
          <View style={ styles.subHeader }>
            <View style={ styles.subHeaderContainer }>
              <Text note>{ this.props.t('ORDER_NEW_HELP') }</Text>
            </View>
          </View>
        )
    }

    return (
      <View />
    )
  }

  render() {

    const { order } = this.props.route.params

    return (
      <Container>
        { this.renderHeader() }
        { this.renderSubHeader() }
        <Content padder testID="accountOrder">
          <TouchableOpacity style={ styles.restaurantContainer }>
            <Icon style={ styles.restaurantText }
              type="FontAwesome" name="cutlery" />
            <Text style={ styles.restaurantText }>
              { order.restaurant.name }
            </Text>
          </TouchableOpacity>
          <OrderItems order={ order } withDeliveryTotal={ true } />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 64,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  subHeader: {
    height: 32,
  },
  subHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
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
})

function mapStateToProps(state) {

  return {
  }
}

function mapDispatchToProps(dispatch) {

  return {
    subscribe: (order, onMessage) => dispatch(subscribe(order, onMessage)),
    unsubscribe: (order) => dispatch(unsubscribe(order)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderTrackingPage))
